/* Comptes et sauvegarde en ligne (Supabase).
   - Connexion par e-mail et mot de passe.
   - Réglages, parcelles et plantations de chaque agriculteur sauvegardés dans sa partie privée.
   - Archives (climat, carburant, El Niño, mercuriales) lues dans la table « archives ». */
(function(){
  'use strict';
  const cfg = window.CMG_CONFIG || {};
  const $ = s => document.querySelector(s);
  const configure = cfg.supabaseUrl && !/VOTRE/.test(cfg.supabaseUrl) && cfg.supabaseAnonKey && !/VOTRE/.test(cfg.supabaseAnonKey);
  if (!configure || !window.supabase || !window.CMG) return; // mode local : pas de comptes

  const sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  const REGLAGES = ['lieu','conso','fuel','trips','place','usure','conduite','surface','vendu','basse','mo','taux','pression','metric','scenario','cats','crop','parcelle','overrides','onboarded'];
  let user = null, applying = false, timer = null;

  /* ----- Archives partagées ----- */
  sb.from('archives').select('cle, contenu').then(({data, error}) => {
    if (error || !data || !data.length) return;
    window.CMG.archives(Object.fromEntries(data.map(r => [r.cle, r.contenu])));
  });

  /* ----- Interface du compte ----- */
  const btn = $('#compteBtn'), box = $('#compte');
  btn.hidden = false;
  btn.addEventListener('click', () => { box.hidden = !box.hidden; if (!box.hidden) { box.scrollIntoView({block:'start'}); (user ? $('#cLogout') : $('#cEmail')).focus({preventScroll:true}); } });
  const msg = (t, err) => { const m = $('#cMsg'); m.textContent = t; m.className = 'msg' + (err ? ' err' : ''); };
  function render(){
    btn.textContent = user ? 'Mon compte' : 'Se connecter';
    $('#compteOut').hidden = !!user; $('#compteIn').hidden = !user;
    if (user) $('#cQui').textContent = user.email;
    const note = document.querySelector('#carnet > .note');
    if (note) note.textContent = user ? 'Votre carnet est sauvegardé dans votre compte. Les rendements notés servent, de façon anonyme, à améliorer le modèle pour tous.'
                                      : 'Vos notes restent sur cet appareil. Créez un compte gratuit pour les sauvegarder et les retrouver sur tous vos appareils.';
  }
  const lire = () => ({email: $('#cEmail').value.trim(), password: $('#cMdp').value});
  $('#compteForm').addEventListener('submit', async e => {
    e.preventDefault(); const {email, password} = lire();
    if (!password) return msg('Entrez votre mot de passe.', true);
    msg('Connexion…');
    const {error} = await sb.auth.signInWithPassword({email, password});
    if (error) msg(error.message.includes('Invalid') ? 'E-mail ou mot de passe incorrect.' : 'Connexion impossible : ' + error.message, true); else { msg(''); box.hidden = true; }
  });
  $('#cSignup').addEventListener('click', async () => {
    const {email, password} = lire();
    if (!email || password.length < 8) return msg('Entrez votre e-mail et un mot de passe de 8 caractères minimum.', true);
    msg('Création du compte…');
    const {data, error} = await sb.auth.signUp({email, password, options:{emailRedirectTo: location.origin + location.pathname}});
    if (error) return msg('Création impossible : ' + error.message, true);
    msg(data.session ? 'Compte créé, vous êtes connecté.' : 'Compte créé. Ouvrez le lien reçu par e-mail pour l’activer, puis connectez-vous.');
  });
  $('#cOubli').addEventListener('click', async () => {
    const {email} = lire(); if (!email) return msg('Entrez d’abord votre e-mail.', true);
    const {error} = await sb.auth.resetPasswordForEmail(email, {redirectTo: location.origin + location.pathname});
    msg(error ? 'Envoi impossible : ' + error.message : 'Un lien pour choisir un nouveau mot de passe vous a été envoyé.', !!error);
  });
  $('#pwdForm').addEventListener('submit', async e => {
    e.preventDefault(); const {error} = await sb.auth.updateUser({password: $('#cMdp2').value});
    $('#cMsg2').textContent = error ? 'Échec : ' + error.message : 'Mot de passe enregistré.';
    if (!error) setTimeout(() => { $('#compteNewPwd').hidden = true; render(); }, 1200);
  });
  $('#cLogout').addEventListener('click', async () => { await sb.auth.signOut(); box.hidden = true; });

  /* ----- Synchronisation ----- */
  const mergeById = (local, distant) => { const m = new Map((local||[]).map(x => [x.id, x])); (distant||[]).forEach(r => m.set(r.id, r.data)); return [...m.values()]; };
  async function tirer(){
    const [p, pa, pl] = await Promise.all([
      sb.from('profils').select('reglages').eq('user_id', user.id).maybeSingle(),
      sb.from('parcelles').select('id, data'),
      sb.from('plantations').select('id, data')
    ]);
    if (p.error || pa.error || pl.error) { $('#cSave').textContent = 'Lecture du compte impossible pour le moment.'; return; }
    const local = window.CMG.etat(), suite = {};
    if (p.data && p.data.reglages) Object.assign(suite, p.data.reglages);
    suite.parcelles = mergeById(local.parcelles, pa.data);
    suite.plantations = mergeById(local.plantations, pl.data);
    applying = true; window.CMG.appliquer(suite); applying = false;
    pousser();
  }
  function pousser(){ clearTimeout(timer); timer = setTimeout(envoyer, 1500); }
  async function envoyer(){
    if (!user) return;
    const st = window.CMG.etat(), reglages = {};
    REGLAGES.forEach(k => { if (st[k] !== undefined) reglages[k] = st[k]; });
    const now = new Date().toISOString(), uid = user.id;
    const r1 = await sb.from('profils').upsert({user_id: uid, reglages, maj: now});
    const rows = (arr) => (arr||[]).map(x => ({user_id: uid, id: x.id, data: x, maj: now}));
    const r2 = st.parcelles.length ? await sb.from('parcelles').upsert(rows(st.parcelles), {onConflict: 'user_id,id'}) : {};
    const r3 = st.plantations.length ? await sb.from('plantations').upsert(rows(st.plantations), {onConflict: 'user_id,id'}) : {};
    for (const [table, list] of [['parcelles', st.parcelles], ['plantations', st.plantations]]) {
      const {data} = await sb.from(table).select('id');
      const gone = (data||[]).map(r => r.id).filter(id => !list.some(x => x.id === id));
      if (gone.length) await sb.from(table).delete().eq('user_id', uid).in('id', gone);
    }
    const err = r1.error || r2.error || r3.error;
    $('#cSave').textContent = err ? 'Sauvegarde impossible pour le moment : vos données restent sur cet appareil.' : 'Sauvegardé à ' + new Date().toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'}) + '.';
  }
  window.addEventListener('cmg:save', () => { if (user && !applying) pousser(); });

  sb.auth.onAuthStateChange((event, session) => {
    user = session ? session.user : null; render();
    if (event === 'PASSWORD_RECOVERY') { box.hidden = false; $('#compteOut').hidden = true; $('#compteIn').hidden = true; $('#compteNewPwd').hidden = false; }
    if (user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) tirer();
  });
  render();
})();
