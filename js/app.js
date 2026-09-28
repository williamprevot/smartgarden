/* SmartGarden : calculs et affichage.
   Les données climatiques, carburant et El Niño embarquées ici servent de secours ;
   l'appli charge ensuite les fichiers de data/ puis la base Supabase si elle est configurée. */
(function(){
'use strict';

/* ---------- Climat : archive des relevés mensuels (Météo-France via Infoclimat), fenêtre glissante de 120 mois ---------- */
let CLIMAT = {"version":1,"source":"Relevés mensuels des stations Météo-France (via Infoclimat) : pluie totale (mm), température moyenne et moyenne des maximales (°C). null = mois non terminé ou manquant.","maj":"2026-09-28","stations":{"cay":{"nom":"Cayenne-Rochambeau","infoclimat":"81405","slug":"cayenne-matoury","annees":{"2015":{"p":[405.5,260.8,595.3,184.3,566.7,470.9,253.2,167.4,46.8,73.3,54.7,310.7],"t":[26.7,26.4,26.4,27.1,26.7,27.0,27.0,27.3,27.9,27.8,27.6,27.1],"x":[29.8,29.4,29.2,30.1,29.6,30.7,31.2,31.6,32.9,32.9,32.2,30.4]},"2016":{"p":[78.2,305.3,363.7,544.0,591.3,429.4,176.7,145.9,69.6,25.9,19.6,537.0],"t":[26.7,27.0,27.2,27.4,27.6,27.1,27.3,27.6,27.7,27.8,27.7,26.9],"x":[30.0,29.5,30.1,30.5,31.0,31.1,31.8,32.4,32.8,33.2,32.7,30.3]},"2017":{"p":[534.6,315.2,360.6,524.9,816.5,379.6,328.6,85.0,56.2,38.0,155.5,643.5],"t":[26.3,26.5,26.7,27.1,26.9,27.3,27.3,27.8,28.4,27.9,27.4,26.7],"x":[29.4,29.7,29.6,30.0,30.2,31.2,31.8,32.8,33.2,32.7,31.8,29.9]},"2018":{"p":[242.5,348.9,315.5,463.1,649.4,296.3,419.9,93.1,34.4,12.7,218.8,390.8],"t":[26.7,25.9,27.1,26.9,26.7,26.7,26.7,27.2,27.8,27.9,27.3,26.6],"x":[29.8,28.7,30.0,30.1,29.6,30.5,30.6,32.0,32.9,33.1,31.3,29.6]},"2019":{"p":[178.3,90.8,35.4,165.8,657.1,458.7,398.9,200.4,66.5,25.9,140.0,554.3],"t":[26.8,27.0,27.0,27.3,27.1,27.0,26.8,27.2,27.9,27.8,27.9,27.1],"x":[29.7,29.8,30.6,30.4,30.1,30.6,31.1,31.8,32.9,32.9,32.7,30.3]},"2020":{"p":[152.8,65.1,232.2,667.9,1046.2,389.8,218.9,173.5,153.2,63.1,305.3,312.7],"t":[26.9,26.8,27.0,27.0,26.9,27.2,27.4,27.7,27.9,27.9,27.2,27.0],"x":[30.0,29.9,30.6,29.8,29.9,30.9,31.7,32.3,33.0,32.9,30.9,30.9]},"2021":{"p":[622.0,311.6,568.0,831.4,729.3,442.9,377.8,267.5,135.5,83.3,197.9,629.0],"t":[26.4,26.7,26.7,26.7,26.8,27.1,27.1,27.5,27.8,27.9,27.3,26.7],"x":[29.3,29.4,30.0,29.6,29.9,30.9,31.2,32.1,32.7,32.6,31.3,29.7]},"2022":{"p":[612.4,1031.3,1057.8,626.4,601.4,356.9,383.2,194.6,41.1,95.8,371.7,445.3],"t":[26.1,25.5,25.7,26.3,26.3,26.5,27.2,27.3,27.7,27.6,27.1,26.3],"x":[29.3,28.5,28.6,29.3,29.9,30.7,31.5,32.4,32.9,32.5,31.3,29.9]},"2023":{"p":[558.6,838.1,245.5,687.2,486.3,215.0,183.6,54.2,19.3,13.1,116.7,285.1],"t":[25.2,25.6,26.5,26.0,26.6,26.7,26.9,27.9,28.2,28.6,28.4,27.7],"x":[28.4,28.4,30.2,29.5,30.1,31.2,31.6,33.0,33.8,34.2,32.6,31.5]},"2024":{"p":[294.1,106.7,328.5,431.7,858.6,317.6,284.4,94.7,17.8,45.6,128.6,522.4],"t":[27.4,27.6,27.9,27.8,27.9,27.7,27.9,28.3,28.7,28.6,28.0,27.1],"x":[30.6,31.1,31.4,30.9,31.1,31.6,32.3,33.2,33.9,33.8,32.5,30.2]},"2025":{"p":[320.9,310.9,635.8,477.4,811.0,468.4,315.3,209.3,44.2,97.0,76.5,450.3],"t":[26.8,26.8,27.0,27.7,27.1,27.2,27.4,27.6,28.0,27.8,27.6,27.0],"x":[30.1,29.7,30.1,31.0,30.3,31.0,31.8,32.2,33.1,32.8,32.0,30.6]},"2026":{"p":[591.0,158.4,771.2,309.2,551.5,361.2,152.1,127.8,null,null,null,null],"t":[26.8,27.2,26.6,27.5,27.6,27.4,27.8,28.0,null,null,null,null],"x":[30.0,30.0,29.4,30.6,30.7,31.2,32.3,32.8,null,null,null,null]}}},"kou":{"nom":"Kourou-CSG","infoclimat":"81403","slug":"kourou","annees":{"2015":{"p":[249.8,190.8,418.2,131.7,559.0,456.4,164.7,60.5,7.4,8.6,85.6,160.9],"t":[26.7,26.7,26.7,27.2,26.6,26.6,26.7,26.9,27.6,27.5,27.9,27.3],"x":[29.2,29.3,29.1,29.7,29.1,29.7,30.3,30.8,32.0,32.4,31.9,29.9]},"2016":{"p":[54.5,274.1,263.0,571.2,305.0,376.2,123.4,41.6,94.3,7.4,6.2,355.1],"t":[27.0,27.0,27.4,27.4,27.4,26.6,26.8,27.4,27.3,27.5,27.6,26.8],"x":[29.8,29.3,29.7,30.0,30.2,29.9,30.6,31.5,31.6,32.2,32.2,29.8]},"2017":{"p":[402.5,263.3,296.3,342.7,704.3,336.6,119.7,9.8,17.6,36.6,139.3,619.4],"t":[26.1,26.6,26.9,27.4,26.5,26.7,26.8,27.4,28.1,27.6,27.4,26.1],"x":[28.6,29.3,29.3,29.7,29.3,30.1,30.7,31.6,32.5,31.9,31.1,28.9]},"2018":{"p":[108.8,242.1,242.0,571.5,428.2,367.6,312.6,60.6,14.6,12.6,254.4,209.5],"t":[26.5,26.0,27.1,26.9,26.9,26.5,26.5,27.0,27.6,27.6,27.6,26.9],"x":[29.1,28.7,29.5,29.4,29.3,29.7,30.0,31.1,32.2,32.5,31.0,29.2]},"2019":{"p":[115.1,92.3,34.7,220.3,441.5,586.3,151.3,140.4,1.4,26.9,85.4,397.1],"t":[27.0,27.2,27.5,27.5,27.2,27.0,26.9,27.1,27.8,27.7,28.0,27.2],"x":[29.4,29.7,30.1,30.2,29.9,30.2,30.9,31.2,32.4,32.5,32.3,29.9]},"2020":{"p":[94.5,55.5,156.2,693.8,685.4,343.5,116.9,61.8,90.1,43.3,384.6,293.2],"t":[27.1,27.2,27.4,27.3,27.2,26.9,27.3,27.6,27.6,27.9,27.1,26.9],"x":[29.8,29.8,30.2,29.8,29.9,30.1,31.3,31.8,32.0,32.5,30.6,30.1]},"2021":{"p":[356.9,184.7,478.5,863.8,683.3,362.3,390.0,150.0,172.3,127.0,203.7,457.4],"t":[26.8,27.1,26.7,26.9,26.9,26.9,27.1,27.3,27.6,27.8,27.5,26.9],"x":[29.3,29.4,29.2,29.5,29.6,30.3,30.8,31.3,31.7,31.8,30.8,29.6]},"2022":{"p":[381.6,597.6,624.8,457.9,479.5,389.2,134.2,226.5,7.0,155.9,257.5,474.6],"t":[26.2,26.5,26.6,26.9,27.2,26.7,27.2,27.4,27.7,27.5,27.2,26.7],"x":[28.9,29.0,28.9,29.5,30.1,30.1,30.9,31.6,32.0,31.7,30.7,29.6]},"2023":{"p":[748.6,588.0,88.0,399.0,370.2,132.3,125.4,40.6,18.0,2.2,42.8,178.2],"t":[26.1,26.2,27.3,27.1,27.5,27.5,27.5,27.9,28.5,29.0,28.9,27.9],"x":[28.7,28.7,29.9,29.8,30.2,31.2,31.4,32.2,33.4,33.8,32.6,31.3]},"2024":{"p":[160.0,53.2,143.4,315.6,803.3,185.0,241.0,54.0,28.5,35.1,52.0,363.6],"t":[28.0,28.2,28.4,28.1,27.6,27.6,27.7,27.8,28.2,28.2,28.2,27.1],"x":[30.6,31.0,31.4,30.7,30.3,31.1,31.4,32.1,32.5,32.8,32.2,29.9]},"2025":{"p":[332.3,258.2,351.6,358.5,711.4,473.5,127.3,37.3,6.9,46.5,83.1,296.9],"t":[26.9,27.1,27.2,27.6,27.0,27.0,27.4,27.4,27.9,27.8,27.7,27.1],"x":[29.6,29.6,29.7,30.3,29.8,30.2,31.3,31.5,32.6,32.6,31.5,30.4]},"2026":{"p":[382.0,42.3,531.2,332.0,422.1,308.0,113.7,15.9,null,null,null,null],"t":[26.9,27.6,26.6,27.4,27.7,27.1,27.5,28.0,null,null,null,null],"x":[29.6,29.9,29.0,29.9,30.3,30.4,31.4,32.3,null,null,null,null]}}},"slm":{"nom":"Saint-Laurent-du-Maroni","infoclimat":"81401","slug":"saint-laurent-du-maroni","annees":{"2015":{"p":[359.8,206.6,191.3,182.0,554.5,467.8,284.8,118.8,75.0,50.1,70.9,162.1],"t":[26.0,26.2,26.4,26.7,26.6,27.0,27.5,28.0,29.0,29.1,28.7,27.1],"x":[29.8,30.4,30.3,30.8,30.2,31.3,32.5,33.5,35.3,35.7,34.6,31.5]},"2016":{"p":[29.1,212.4,161.7,418.4,454.8,417.7,102.2,178.5,66.2,61.7,56.4,321.2],"t":[26.6,26.8,27.3,27.3,27.6,26.9,27.9,28.4,28.9,29.1,28.7,27.2],"x":[31.5,30.2,31.4,31.3,31.4,31.2,33.2,34.2,34.9,35.6,34.6,31.6]},"2017":{"p":[359.6,208.3,195.8,360.2,627.1,232.8,192.9,99.5,136.3,60.9,131.3,337.6],"t":[26.3,26.5,26.7,27.0,27.2,27.9,28.0,28.7,29.0,28.6,27.7,26.7],"x":[30.1,30.8,31.0,31.0,31.1,32.5,33.4,34.7,35.1,34.3,32.8,30.6]},"2018":{"p":[148.4,117.0,197.6,653.3,304.2,367.7,260.8,196.2,60.0,68.6,164.9,237.4],"t":[26.2,26.0,26.5,26.4,26.8,26.9,27.3,27.7,28.3,28.8,27.8,26.1],"x":[30.8,30.0,30.8,29.9,30.4,31.1,31.9,33.2,34.1,34.9,32.7,30.1]},"2019":{"p":[106.3,79.8,22.4,172.9,455.8,275.2,173.3,160.0,9.4,91.8,97.8,208.2],"t":[26.3,26.3,27.1,27.4,27.5,27.4,27.5,28.2,29.5,28.7,28.7,27.1],"x":[30.6,30.5,32.3,31.9,31.1,31.5,32.6,33.6,35.9,34.6,34.1,31.1]},"2020":{"p":[96.1,40.4,120.4,290.0,550.0,285.9,182.0,215.9,54.8,92.1,219.9,254.7],"t":[26.9,26.6,27.5,27.5,27.4,27.3,28.2,28.5,29.0,28.8,27.8,27.2],"x":[31.4,31.5,32.6,31.5,30.9,31.4,33.3,34.0,35.2,34.7,32.4,31.6]},"2021":{"p":[355.4,98.7,185.1,497.9,474.7,212.6,220.7,248.4,227.6,103.7,205.0,323.1],"t":[26.7,26.5,27.0,26.9,27.1,27.5,27.9,28.3,28.4,28.8,28.0,27.3],"x":[30.6,30.4,31.4,30.6,30.6,31.8,32.8,33.5,34.0,34.3,32.8,31.3]},"2022":{"p":[170.1,254.2,402.0,403.5,466.0,243.3,246.3,175.3,101.6,172.1,310.1,262.0],"t":[26.6,26.7,26.9,27.3,27.2,27.5,28.1,28.4,28.9,28.6,27.8,26.8],"x":[30.8,30.5,30.6,31.1,31.1,31.9,33.0,34.0,34.8,34.2,32.6,31.0]},"2023":{"p":[348.4,652.8,86.9,321.1,402.8,325.4,207.8,131.5,58.1,37.6,94.2,183.4],"t":[26.2,26.4,26.9,27.7,27.8,28.3,28.4,29.2,29.8,30.5,29.2,28.2],"x":[30.2,29.9,31.9,32.5,32.0,33.1,33.5,35.2,36.4,37.3,34.7,33.0]},"2024":{"p":[102.3,28.5,90.6,277.9,574.5,392.4,203.5,137.3,32.7,74.9,221.6,325.8],"t":[27.6,28.1,28.7,28.4,28.2,28.4,28.5,29.0,29.8,29.6,28.8,27.2],"x":[32.7,33.8,34.0,32.8,32.1,33.0,33.3,34.5,35.8,35.4,34.2,31.1]},"2025":{"p":[210.9,184.3,134.3,375.5,386.0,560.8,291.4,177.9,19.9,94.0,152.4,181.2],"t":[26.7,26.9,27.3,27.7,27.5,27.5,28.1,28.2,29.2,28.9,28.2,27.7],"x":[31.1,30.8,31.6,31.6,31.3,32.0,33.0,33.5,35.5,35.0,33.4,32.1]},"2026":{"p":[241.4,25.1,314.6,329.0,428.7,256.0,70.2,18.4,null,null,null,null],"t":[27.0,27.0,27.2,27.4,27.6,27.9,28.2,28.6,null,null,null,null],"x":[31.1,31.9,31.2,31.2,31.2,32.2,33.2,34.2,null,null,null,null]}}},"stg":{"nom":"Saint-Georges-de-l’Oyapock","infoclimat":"81408","slug":"saint-georges","annees":{"2015":{"p":[269.8,355.1,815.5,327.2,545.4,261.9,218.3,82.9,12.7,14.2,87.7,274.8],"t":[26.5,26.2,26.0,26.7,26.7,27.1,27.2,27.6,28.2,28.6,28.2,27.1],"x":[30.4,30.1,29.1,30.7,30.4,31.5,32.1,32.8,34.4,35.3,34.1,31.4]},"2016":{"p":[128.8,431.6,314.7,636.3,468.7,254.3,157.5,47.0,30.0,3.6,10.2,389.3],"t":[26.6,27.1,27.5,27.4,27.7,27.3,27.3,28.1,28.6,28.6,28.8,27.4],"x":[30.8,30.3,31.0,31.1,31.5,31.8,32.2,33.7,34.9,35.1,35.1,31.7]},"2017":{"p":[617.2,399.3,581.4,561.6,681.2,310.7,226.2,8.6,56.1,15.0,124.7,440.6],"t":[26.3,26.4,26.3,27.1,27.1,27.1,27.3,28.1,28.7,28.5,27.9,26.8],"x":[29.9,30.0,29.6,31.0,30.8,31.1,32.2,34.0,34.3,34.5,33.3,30.7]},"2018":{"p":[424.9,451.0,336.3,650.2,755.1,352.6,289.9,22.2,67.1,15.1,246.2,440.5],"t":[26.1,25.7,26.6,26.2,26.3,26.7,27.1,27.6,28.1,28.5,27.7,26.0],"x":[29.7,28.8,30.4,29.4,29.4,30.7,31.5,33.3,34.1,34.9,32.4,29.5]},"2019":{"p":[315.2,124.1,61.4,325.2,504.8,272.3,239.6,119.6,28.8,25.4,84.1,320.0],"t":[26.4,26.7,26.7,26.8,26.9,27.4,27.1,27.7,28.7,28.5,28.7,27.2],"x":[29.8,30.6,31.3,30.4,29.8,31.2,31.4,32.6,34.5,34.5,34.2,30.8]},"2020":{"p":[173.1,195.8,423.1,577.0,850.0,377.5,169.3,89.3,34.3,44.7,225.5,214.6],"t":[26.8,26.7,27.1,27.3,26.4,26.9,27.6,28.3,28.5,28.8,27.4,27.3],"x":[30.6,30.8,31.3,30.5,29.2,30.7,32.2,33.6,34.2,34.6,31.5,31.5]},"2021":{"p":[509.7,386.1,482.3,800.3,656.6,233.0,283.4,146.0,131.6,112.9,242.9,796.9],"t":[26.3,26.2,26.4,26.4,26.4,26.8,26.9,27.9,28.3,28.0,27.3,26.1],"x":[29.3,29.4,30.0,29.4,29.2,30.6,31.0,32.7,33.7,33.1,31.4,28.8]},"2022":{"p":[508.5,529.0,754.2,712.9,764.3,270.3,379.8,144.1,47.4,112.0,187.4,507.5],"t":[26.0,26.3,26.2,26.5,26.8,27.0,27.2,27.7,28.2,28.5,27.4,26.7],"x":[29.5,29.6,29.3,29.7,30.5,31.4,31.9,33.1,34.2,34.2,31.9,30.5]},"2023":{"p":[476.5,656.7,156.4,461.9,327.5,265.8,184.7,24.3,10.1,16.2,88.8,237.3],"t":[26.0,26.3,26.8,26.6,27.5,27.7,27.7,28.6,29.1,29.6,29.0,28.0],"x":[29.3,29.7,31.0,30.4,31.3,32.1,32.4,34.3,35.3,35.9,34.3,32.4]},"2024":{"p":[398.0,258.1,263.0,366.0,709.5,258.0,162.3,93.7,12.4,51.8,124.9,302.2],"t":[27.1,27.4,27.8,27.8,27.5,27.8,27.9,28.1,28.7,29.1,28.4,27.1],"x":[30.7,31.8,31.8,31.5,30.8,31.9,32.6,33.5,34.4,35.1,33.6,30.9]},"2025":{"p":[346.9,432.9,453.8,547.0,529.1,407.4,239.0,130.7,5.4,59.1,71.5,415.7],"t":[26.8,26.7,27.0,27.3,27.2,27.2,27.4,27.8,28.4,28.3,28.0,27.0],"x":[30.8,30.1,30.7,30.9,30.8,31.2,32.0,32.9,34.1,34.1,33.3,31.2]},"2026":{"p":[336.3,214.3,849.6,373.2,426.6,375.1,111.8,14.3,null,null,null,null],"t":[26.7,26.6,26.4,27.4,27.2,27.6,28.0,28.5,null,null,null,null],"x":[30.3,30.4,29.5,31.0,30.5,31.8,33.1,34.1,null,null,null,null]}}},"mar":{"nom":"Maripasoula","infoclimat":"81415","slug":"maripasoula","annees":{"2015":{"p":[281.6,277.5,472.9,290.6,447.6,377.5,208.1,119.7,11.2,5.5,87.3,173.2],"t":[27.3,27.0,26.9,27.2,27.4,27.8,27.7,27.9,28.6,29.2,28.9,27.7],"x":[31.7,31.4,31.0,31.7,31.6,32.5,32.7,32.9,34.8,35.9,34.8,32.4]},"2016":{"p":[55.1,266.7,270.1,457.5,270.9,283.2,181.0,151.1,67.5,46.5,69.8,210.3],"t":[27.5,27.5,28.0,28.1,28.1,27.6,27.8,28.3,28.7,28.7,28.8,27.7],"x":[32.3,31.6,32.3,32.3,32.5,32.3,32.9,34.0,34.6,34.9,34.6,32.3]},"2017":{"p":[277.3,320.0,340.9,251.1,330.0,320.0,180.0,53.7,103.3,96.8,95.6,241.4],"t":[26.8,27.0,27.2,27.6,27.8,27.7,27.7,28.6,28.6,28.4,28.4,27.4],"x":[31.1,31.4,31.6,31.9,32.2,32.3,32.9,34.5,34.5,34.2,33.9,31.9]},"2018":{"p":[235.0,178.6,195.2,421.0,407.4,291.0,293.2,107.5,44.3,71.7,140.5,153.7],"t":[26.8,26.6,27.3,27.3,27.3,27.3,27.5,27.7,28.5,28.9,28.2,26.9],"x":[31.4,31.1,31.6,31.6,31.4,31.7,32.3,33.6,34.3,35.3,33.4,31.3]},"2019":{"p":[164.6,72.1,22.8,246.3,383.0,291.0,257.2,124.9,48.8,133.8,105.9,273.0],"t":[27.0,27.2,27.8,27.7,27.9,28.2,27.8,28.0,29.1,28.8,28.9,28.0],"x":[31.4,31.7,33.0,32.4,32.2,33.0,33.0,33.6,35.5,34.9,34.7,32.8]},"2020":{"p":[91.3,96.6,65.0,285.0,300.0,230.5,142.7,237.3,21.1,126.7,267.5,392.7],"t":[27.5,27.3,28.2,27.8,28.0,27.9,27.9,28.4,28.7,28.8,28.0,27.8],"x":[32.5,32.4,33.7,32.1,32.3,32.5,33.1,33.6,34.7,34.8,32.9,32.7]},"2021":{"p":[401.1,159.4,271.2,447.0,498.7,388.8,389.6,83.1,86.4,101.5,153.2,300.8],"t":[27.1,26.8,27.3,27.2,27.4,27.7,27.6,28.1,28.2,28.7,28.3,27.0],"x":[31.3,31.0,31.9,31.3,31.5,32.5,32.6,33.2,33.9,34.3,33.4,30.9]},"2022":{"p":[128.5,303.2,486.2,290.0,296.4,304.3,316.0,180.2,29.5,103.7,339.9,264.0],"t":[26.9,27.0,26.9,27.4,27.6,27.3,27.7,28.0,28.6,28.8,27.9,27.3],"x":[31.3,31.1,30.8,31.4,31.8,31.6,32.3,33.3,34.4,34.4,32.8,31.7]},"2023":{"p":[316.0,400.1,180.3,242.5,401.5,225.6,109.4,113.4,19.6,18.8,99.7,237.6],"t":[26.5,26.8,27.3,27.6,28.3,28.2,27.9,28.8,29.1,29.9,29.7,28.6],"x":[30.6,30.6,31.9,31.9,32.6,32.9,32.8,34.3,35.4,36.6,35.5,33.5]},"2024":{"p":[147.9,70.4,124.2,252.2,479.7,231.2,176.7,110.5,46.3,11.3,140.4,195.0],"t":[27.8,28.3,28.8,28.6,28.6,28.2,28.3,28.8,29.4,29.9,29.3,28.0],"x":[32.3,33.2,33.6,33.0,32.8,32.6,33.1,34.2,35.3,36.2,35.1,32.6]},"2025":{"p":[155.0,265.6,297.3,361.1,300.0,293.1,145.3,144.0,56.1,87.6,64.5,182.1],"t":[27.5,27.1,27.5,27.7,27.6,27.1,27.6,27.6,28.5,28.8,29.0,27.9],"x":[32.1,31.1,31.7,31.8,31.4,31.1,32.2,32.3,34.2,34.9,34.8,32.6]},"2026":{"p":[207.5,78.9,266.2,295.7,318.6,340.0,97.8,28.3,null,null,null,null],"t":[27.5,27.3,27.4,27.9,28.0,27.8,28.5,28.9,null,null,null,null],"x":[32.0,31.8,31.6,32.2,32.2,32.5,33.9,34.7,null,null,null,null]}}}}};
let ENSO = {"version":1,"maj":"2026-09-28","source":"NOAA Climate Prediction Center (discussion ENSO du 10 sept. 2026) et IRI (prévision de sept. 2026). Indice ONI de chaque saison passée : pic de l'hiver, valeurs arrondies.","prevision":{"emission":"2026-09","etat":"nino","libelle":"El Niño très fort","oni":2.5,"confiance":0.95,"horizon":"2027-05","texte":"El Niño se renforce : plus de 90 % de chances d'un épisode très fort à l'automne et l'hiver 2026-2027 (NOAA). L'IRI donne El Niño à près de 100 % jusqu'au printemps 2027."},"saisons":{"2015-16":2.6,"2016-17":-0.7,"2017-18":-0.9,"2018-19":0.9,"2019-20":0.5,"2020-21":-1.3,"2021-22":-1.0,"2022-23":-1.0,"2023-24":2.0,"2024-25":-0.6,"2025-26":-0.6}};
const NY = 11, NM = 132;
const NORM = {
  cay:{p:[399.4,334.8,315.4,443.2,600.0,392.2,262.2,135.4,63.2,54.9,135.2,352.3],t:[26.4,26.4,26.7,26.9,26.8,26.8,26.8,27.2,27.4,27.5,27.2,26.7]},
  kou:{p:[319.5,251.6,246.4,405.6,489.0,382.2,165.1,82.3,28.0,41.5,124.7,273.6],t:[26.6,26.7,27.0,27.1,26.9,26.6,26.7,27.1,27.4,27.6,27.4,26.9]},
  stg:{p:[394.3,390.0,375.9,471.5,545.9,331.2,207.7,101.5,41.1,44.3,114.7,294.3],t:[26.1,26.2,26.4,26.6,26.7,26.7,26.8,27.4,27.8,28.0,27.6,26.8]},
  mar:{p:[223.1,235.3,238.7,284.7,354.0,280.8,204.8,159.7,58.1,69.8,111.9,194.7],t:[26.8,26.8,27.1,27.4,27.4,27.3,27.3,27.6,27.9,28.2,28.1,27.4]},
  slm:{p:[260,180,190,240,367,330,250,170,110,106,160,250],t:null}
};
let CARBU = {"version":1,"source":"Prix maximums de vente au détail en Guyane, fixés chaque mois par arrêté préfectoral (relevés via France-Guyane, Péyi Guyane et Kiprix). Les stations vendent en pratique à ce prix.","maj":"2026-09-28","unite":"EUR/L","mois":{"2021-01":{"essence":1.50,"gazole":1.33},"2022-06":{"essence":2.06,"gazole":1.91},"2022-07":{"essence":2.10,"gazole":2.07},"2022-12":{"essence":1.84,"gazole":1.96},"2023-01":{"essence":1.73,"gazole":1.85},"2023-12":{"essence":1.87,"gazole":1.83},"2024-01":{"essence":1.80,"gazole":1.75},"2024-08":{"essence":1.98,"gazole":1.83},"2024-09":{"essence":1.96,"gazole":1.77},"2024-10":{"essence":1.90,"gazole":1.76},"2024-11":{"essence":1.90,"gazole":1.75},"2025-01":{"essence":1.88,"gazole":1.78},"2025-06":{"essence":1.95,"gazole":1.75},"2025-07":{"essence":1.95,"gazole":1.81},"2026-01":{"essence":1.76,"gazole":1.65},"2026-02":{"essence":1.79,"gazole":1.72},"2026-03":{"essence":1.81,"gazole":1.75},"2026-04":{"essence":1.98,"gazole":1.99},"2026-05":{"essence":2.08,"gazole":2.19},"2026-06":{"essence":2.12,"gazole":2.19},"2026-07":{"essence":2.12,"gazole":2.19},"2026-08":{"essence":2.03,"gazole":2.02},"2026-09":{"essence":2.02,"gazole":2.18}}};

/* ---------- Réseau routier (km par la route, grands axes) ---------- */
const NODES = [
  {id:'cayenne',nom:'Cayenne',lat:4.9372,lon:-52.3260,zone:'cayenne'},{id:'remire',nom:'Rémire-Montjoly',lat:4.9160,lon:-52.2760,zone:'cayenne'},{id:'matoury',nom:'Matoury',lat:4.8470,lon:-52.3310,zone:'cayenne'},
  {id:'tonate',nom:'Macouria (Tonate)',lat:4.9550,lon:-52.4750,zone:'macouria'},{id:'montsinery',nom:'Montsinéry',lat:4.8950,lon:-52.4990,zone:'macouria'},{id:'tonnegrande',nom:'Tonnegrande',lat:4.8330,lon:-52.4630,zone:'macouria'},
  {id:'kourou',nom:'Kourou',lat:5.1600,lon:-52.6500,zone:'kourou'},{id:'sinnamary',nom:'Sinnamary',lat:5.3780,lon:-52.9580,zone:'kourou'},{id:'iracoubo',nom:'Iracoubo',lat:5.4810,lon:-53.2050,zone:'kourou'},
  {id:'slm',nom:'Saint-Laurent-du-Maroni',lat:5.4980,lon:-54.0280,zone:'ouest'},{id:'javouhey',nom:'Javouhey',lat:5.6280,lon:-53.8700,zone:'ouest'},{id:'mana',nom:'Mana',lat:5.6600,lon:-53.7800,zone:'ouest'},{id:'awala',nom:'Awala-Yalimapo',lat:5.7400,lon:-53.9300,zone:'ouest'},{id:'apatou',nom:'Apatou',lat:5.1560,lon:-54.3440,zone:'ouest'},
  {id:'roura',nom:'Roura',lat:4.7300,lon:-52.3300,zone:'cacao'},{id:'cacao',nom:'Cacao',lat:4.5720,lon:-52.4680,zone:'cacao'},{id:'kaw',nom:'Kaw',lat:4.4830,lon:-52.0330,zone:'cacao'},
  {id:'regina',nom:'Régina',lat:4.3130,lon:-52.1330,zone:'est'},{id:'stgeorges',nom:'Saint-Georges-de-l\u2019Oyapock',lat:3.8910,lon:-51.8040,zone:'est'},
  {id:'maripasoula',nom:'Maripasoula',lat:3.6400,lon:-54.0280,zone:'fleuve',fret:true},{id:'papaichton',nom:'Papaïchton',lat:3.8000,lon:-54.1500,zone:'fleuve',fret:true},{id:'grandsanti',nom:'Grand-Santi',lat:4.2500,lon:-54.3800,zone:'fleuve',fret:true},{id:'saul',nom:'Saül',lat:3.6200,lon:-53.2100,zone:'fleuve',fret:true}
];
const EDGES = [['cayenne','remire',8],['cayenne','matoury',11],['remire','matoury',13],['cayenne','tonate',21],['matoury','tonate',19],['tonate','montsinery',13],['montsinery','tonnegrande',16],['tonnegrande','matoury',20],
  ['tonate','kourou',40],['kourou','sinnamary',55],['sinnamary','iracoubo',31],['iracoubo','slm',102],['slm','javouhey',34],['javouhey','mana',14],['mana','awala',20],['slm','apatou',50],
  ['matoury','roura',17],['roura','cacao',45],['roura','kaw',55],['matoury','regina',100],['regina','stgeorges',85]];
const MARKET_NODE = {cayenne:'cayenne', remire:'remire', matoury:'matoury', kourou:'kourou', stlaurent:'slm'};
const NODE = Object.fromEntries(NODES.map(n=>[n.id,n]));
const ADJ = {}; EDGES.forEach(([a,b,km])=>{ (ADJ[a]=ADJ[a]||[]).push([b,km]); (ADJ[b]=ADJ[b]||[]).push([a,km]); });
const DIST = {};
for (const n of NODES) if (ADJ[n.id]){ const d = {[n.id]:0}, done = new Set(); for(;;){ let u = null; for (const k in d) if (!done.has(k) && (u===null || d[k]<d[u])) u = k; if (u===null) break; done.add(u); for (const [v,km] of ADJ[u]) if (d[v]==null || d[u]+km < d[v]) d[v] = d[u]+km; } DIST[n.id] = d; }

const STN = {cay:'Cayenne-Rochambeau', kou:'Kourou-CSG', slm:'Saint-Laurent-du-Maroni', stg:'Saint-Georges-de-l’Oyapock', mar:'Maripasoula'};
const MOIS = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];

const ZONES = [
  {id:'cayenne', nom:'Île de Cayenne', communes:'Cayenne, Rémire-Montjoly, Matoury', st:['cay'], dist:{cayenne:5,remire:8,matoury:10,kourou:60,stlaurent:255}, local:0.85},
  {id:'macouria', nom:'Macouria – Montsinéry', communes:'Macouria, Tonate, Montsinéry-Tonnegrande', st:['cay','kou'], dist:{cayenne:25,remire:32,matoury:25,kourou:38,stlaurent:225}, local:0.80},
  {id:'kourou', nom:'Kourou – Sinnamary', communes:'Kourou, Sinnamary, Iracoubo', st:['kou'], dist:{cayenne:62,remire:68,matoury:58,kourou:6,stlaurent:195}, local:0.82},
  {id:'ouest', nom:'Ouest – Saint-Laurent, Mana', communes:'Saint-Laurent-du-Maroni, Mana, Javouhey, Apatou', st:['slm'], dist:{cayenne:252,remire:258,matoury:246,kourou:192,stlaurent:15}, local:0.75},
  {id:'cacao', nom:'Cacao – Roura', communes:'Cacao, Roura, Dégrad-des-Cannes', st:['cay','stg'], dist:{cayenne:72,remire:75,matoury:62,kourou:125,stlaurent:315}, local:0.75},
  {id:'est', nom:'Est – Régina, Saint-Georges', communes:'Régina, Saint-Georges-de-l’Oyapock', st:['stg'], dist:{cayenne:150,remire:155,matoury:140,kourou:210,stlaurent:400}, local:0.80},
  {id:'fleuve', nom:'Fleuve – Maripasoula', communes:'Maripasoula, Papaïchton, Grand-Santi', st:['mar'], dist:null, fret:1.6, local:1.10}
];

const MARCHES = [
  {id:'cayenne', nom:'Cayenne', mult:1.00, amp:1.00},
  {id:'remire', nom:'Rémire-Montjoly', mult:1.00, amp:1.00},
  {id:'matoury', nom:'Matoury', mult:1.00, amp:1.00},
  {id:'kourou', nom:'Kourou', mult:1.00, amp:1.00},
  {id:'stlaurent', nom:'Saint-Laurent-du-Maroni', mult:0.88, amp:0.75},
  {id:'local', nom:'Bord de champ (vente directe)', mult:1.00, amp:0.90, local:true}
];
const CATS = {feuille:{nom:'Légumes-feuilles'}, fruit:{nom:'Légumes-fruits'}, courge:{nom:'Courges, haricots, maïs'}, racine:{nom:'Racines et tubercules'}};

/* cycle = jours de la plantation à la 1re récolte en bonnes conditions ; recS = semaines de récolte ; rdt kg/m² ; prix €/kg moyen annuel à Cayenne ;
   cout €/m² (intrants + main-d'œuvre) ; anim = part de la récolte perdue (animaux, ravageurs) en pression moyenne ; pluieMax mm/mois toléré ; besoin mm/mois ;
   sP/sS/sH sensibilité pluie/sécheresse/humidité ; tmin-tmax plage idéale ; tcrit T° max critique ; amp amplitude saisonnière des prix */
const CULTURES = [
  {id:'laitue',nom:'Laitue',cat:'feuille',lune:'haut',cycle:45,recS:2,rdt:2.5,prix:6.5,cout:3.0,anim:.08,nuis:'limaces, chenilles, fourmis-manioc',pluieMax:200,besoin:120,sP:.8,sS:.9,sH:.6,tmin:20,tmax:27,tcrit:31,amp:1.2,paques:false,abri:true},
  {id:'chou_chinois',nom:'Chou chinois (pak-choï)',cat:'feuille',lune:'haut',cycle:40,recS:2,rdt:3.0,prix:4.5,cout:2.2,anim:.12,nuis:'chenilles, altises, fourmis-manioc',pluieMax:220,besoin:120,sP:.6,sS:.8,sH:.5,tmin:20,tmax:28,tcrit:32,amp:1.0,paques:false,abri:true},
  {id:'chou',nom:'Chou pommé',cat:'feuille',lune:'haut',cycle:90,recS:3,rdt:3.5,prix:3.5,cout:2.5,anim:.15,nuis:'teigne et chenilles du chou, pucerons',pluieMax:220,besoin:120,sP:.7,sS:.7,sH:.6,tmin:18,tmax:27,tcrit:32,amp:1.0,paques:true,abri:true},
  {id:'bredes',nom:'Bredes (épinard pays)',cat:'feuille',lune:'haut',cycle:30,recS:4,rdt:2.5,prix:5.0,cout:1.8,anim:.08,nuis:'chenilles, criquets',pluieMax:350,besoin:120,sP:.4,sS:.7,sH:.3,tmin:22,tmax:32,tcrit:35,amp:.7,paques:true,abri:false},
  {id:'cive',nom:'Cive',cat:'feuille',lune:'haut',cycle:75,recS:6,rdt:2.5,prix:9.0,cout:2.5,anim:.05,nuis:'thrips, fourmis-manioc',pluieMax:280,besoin:110,sP:.5,sS:.6,sH:.4,tmin:20,tmax:30,tcrit:34,amp:1.0,paques:false,abri:true},
  {id:'persil',nom:'Persil',cat:'feuille',lune:'haut',cycle:70,recS:8,rdt:1.5,prix:12.0,cout:2.5,anim:.06,nuis:'chenilles, fourmis-manioc',pluieMax:250,besoin:110,sP:.6,sS:.7,sH:.5,tmin:18,tmax:28,tcrit:32,amp:1.0,paques:false,abri:true},
  {id:'tomate',nom:'Tomate',cat:'fruit',lune:'haut',cycle:110,recS:6,rdt:5.0,prix:5.5,cout:6.0,anim:.12,nuis:'oiseaux, rongeurs, mouches des fruits, noctuelles',pluieMax:180,besoin:130,sP:1.0,sS:.8,sH:.9,tmin:20,tmax:27,tcrit:32,amp:1.35,paques:false,abri:true},
  {id:'concombre',nom:'Concombre',cat:'fruit',lune:'haut',cycle:50,recS:4,rdt:4.0,prix:3.2,cout:3.0,anim:.12,nuis:'chrysomèles, rongeurs, pucerons',pluieMax:250,besoin:130,sP:.7,sS:.8,sH:.7,tmin:22,tmax:30,tcrit:34,amp:1.1,paques:true,abri:true},
  {id:'poivron',nom:'Poivron',cat:'fruit',lune:'haut',cycle:120,recS:8,rdt:2.5,prix:6.5,cout:4.5,anim:.10,nuis:'oiseaux, mouches des fruits, acariens',pluieMax:200,besoin:130,sP:.8,sS:.7,sH:.7,tmin:21,tmax:29,tcrit:33,amp:1.2,paques:false,abri:true},
  {id:'aubergine',nom:'Aubergine',cat:'fruit',lune:'haut',cycle:100,recS:10,rdt:4.0,prix:4.0,cout:3.5,anim:.10,nuis:'chenilles foreuses, acariens',pluieMax:300,besoin:130,sP:.5,sS:.6,sH:.5,tmin:22,tmax:32,tcrit:35,amp:.9,paques:true,abri:true},
  {id:'gombo',nom:'Gombo',cat:'fruit',lune:'haut',cycle:55,recS:10,rdt:1.8,prix:7.0,cout:2.5,anim:.08,nuis:'pucerons, punaises',pluieMax:350,besoin:120,sP:.3,sS:.5,sH:.3,tmin:24,tmax:33,tcrit:36,amp:.8,paques:false,abri:false},
  {id:'piment',nom:'Piment',cat:'fruit',lune:'haut',cycle:110,recS:16,rdt:1.2,prix:12.0,cout:3.5,anim:.08,nuis:'oiseaux, mouches des fruits',pluieMax:250,besoin:120,sP:.6,sS:.6,sH:.6,tmin:22,tmax:30,tcrit:34,amp:.9,paques:false,abri:true},
  {id:'giraumon',nom:'Giraumon',cat:'courge',lune:'haut',cycle:100,recS:3,rdt:2.5,prix:2.8,cout:1.2,anim:.12,nuis:'rongeurs, agoutis, chrysomèles',pluieMax:280,besoin:110,sP:.6,sS:.5,sH:.6,tmin:22,tmax:30,tcrit:34,amp:.5,paques:false,abri:false},
  {id:'pasteque',nom:'Pastèque',cat:'courge',lune:'haut',cycle:80,recS:3,rdt:3.5,prix:2.0,cout:1.4,anim:.15,nuis:'rongeurs, agoutis, pakiras',pluieMax:180,besoin:120,sP:.9,sS:.5,sH:.7,tmin:22,tmax:32,tcrit:36,amp:1.0,paques:false,abri:false},
  {id:'melon',nom:'Melon',cat:'courge',lune:'haut',cycle:75,recS:3,rdt:2.0,prix:4.0,cout:2.0,anim:.15,nuis:'rongeurs, agoutis, mouches des fruits',pluieMax:160,besoin:120,sP:1.0,sS:.5,sH:.9,tmin:22,tmax:32,tcrit:36,amp:1.1,paques:false,abri:true},
  {id:'haricot',nom:'Haricot kilomètre',cat:'courge',lune:'haut',cycle:60,recS:6,rdt:2.0,prix:6.0,cout:2.5,anim:.10,nuis:'pucerons, chenilles, oiseaux',pluieMax:300,besoin:120,sP:.4,sS:.6,sH:.4,tmin:22,tmax:32,tcrit:35,amp:.9,paques:true,abri:false},
  {id:'mais',nom:'Maïs doux',cat:'courge',lune:'haut',cycle:80,recS:2,rdt:1.2,prix:3.0,cout:1.0,anim:.25,nuis:'oiseaux, rongeurs, agoutis',pluieMax:350,besoin:120,sP:.3,sS:.6,sH:.3,tmin:22,tmax:32,tcrit:36,amp:.6,paques:false,abri:false},
  {id:'patate',nom:'Patate douce',cat:'racine',lune:'bas',cycle:120,recS:4,rdt:2.0,prix:3.2,cout:1.0,anim:.15,nuis:'charançon de la patate, rongeurs, pakiras',pluieMax:350,besoin:100,sP:.4,sS:.4,sH:.1,tmin:22,tmax:32,tcrit:36,amp:.4,paques:false,abri:false},
  {id:'dachine',nom:'Dachine',cat:'racine',lune:'bas',cycle:240,recS:6,rdt:2.0,prix:3.8,cout:1.5,anim:.12,nuis:'agoutis, pakiras, cochons-bois',pluieMax:800,besoin:170,sP:0,sS:.8,sH:.1,tmin:22,tmax:32,tcrit:36,amp:.4,paques:false,abri:false},
  {id:'igname',nom:'Igname',cat:'racine',lune:'bas',cycle:270,recS:6,rdt:2.5,prix:4.0,cout:2.0,anim:.12,nuis:'agoutis, cochons-bois, cochenilles',pluieMax:450,besoin:110,sP:.3,sS:.4,sH:.2,tmin:22,tmax:32,tcrit:36,amp:.5,paques:false,abri:false},
  {id:'manioc',nom:'Manioc (racines fraîches)',cat:'racine',lune:'bas',cycle:300,recS:8,rdt:2.5,prix:1.8,cout:.8,anim:.12,nuis:'agoutis, pakiras, cochons-bois, fourmis-manioc',pluieMax:450,besoin:90,sP:.3,sS:.2,sH:.1,tmin:22,tmax:33,tcrit:37,amp:.3,paques:false,abri:false},
  {id:'gingembre',nom:'Gingembre',cat:'racine',lune:'bas',cycle:270,recS:6,rdt:1.5,prix:7.0,cout:3.0,anim:.05,nuis:'rongeurs, nématodes',pluieMax:400,besoin:120,sP:.4,sS:.6,sH:.3,tmin:22,tmax:30,tcrit:34,amp:.5,paques:false,abri:false}
];
/* Intrants hors main-d'œuvre (cout, €/m², prix 2026), dont semences ou plants (pl), heures de travail pour 100 m² et par culture hors vente (h), famille botanique (fam) */
const EXTRA = {laitue:{fam:'asteracees',cout:1.2,pl:.6,h:18}, chou_chinois:{fam:'brassicacees',cout:.9,pl:.4,h:14}, chou:{fam:'brassicacees',cout:1.0,pl:.5,h:16}, bredes:{fam:'amaranthacees',cout:.6,pl:.2,h:14},
  cive:{fam:'alliacees',cout:1.0,pl:.5,h:22}, persil:{fam:'apiacees',cout:.9,pl:.3,h:20}, tomate:{fam:'solanacees',cout:2.5,pl:1.2,h:45}, concombre:{fam:'cucurbitacees',cout:1.3,pl:.5,h:25},
  poivron:{fam:'solanacees',cout:1.8,pl:.9,h:35}, aubergine:{fam:'solanacees',cout:1.5,pl:.7,h:30}, gombo:{fam:'malvacees',cout:.8,pl:.2,h:30}, piment:{fam:'solanacees',cout:1.3,pl:.6,h:40},
  giraumon:{fam:'cucurbitacees',cout:.5,pl:.1,h:8}, pasteque:{fam:'cucurbitacees',cout:.7,pl:.2,h:10}, melon:{fam:'cucurbitacees',cout:1.0,pl:.4,h:14}, haricot:{fam:'fabacees',cout:.9,pl:.3,h:28},
  mais:{fam:'poacees',cout:.4,pl:.15,h:6}, patate:{fam:'convolvulacees',cout:.5,pl:.2,h:10}, dachine:{fam:'aracees',cout:.7,pl:.4,h:12}, igname:{fam:'dioscoreacees',cout:1.0,pl:.6,h:15},
  manioc:{fam:'euphorbiacees',cout:.3,pl:.1,h:8}, gingembre:{fam:'zingiberacees',cout:1.8,pl:1.2,h:20}};
CULTURES.forEach(c=>Object.assign(c, EXTRA[c.id]));
const FAM = {asteracees:'astéracées', brassicacees:'choux (brassicacées)', amaranthacees:'amarantes', alliacees:'alliacées', apiacees:'apiacées', solanacees:'solanacées', cucurbitacees:'cucurbitacées',
  malvacees:'malvacées', fabacees:'légumineuses', poacees:'graminées', convolvulacees:'convolvulacées', aracees:'aracées', dioscoreacees:'ignames', euphorbiacees:'euphorbiacées', zingiberacees:'zingibéracées'};
const CROP = Object.fromEntries(CULTURES.map(c=>[c.id,c]));

/* Sols : grands domaines géologiques de Guyane (BRGM) et sols qu'ils donnent en terre haute et en terre basse */
const SOLS = {
  ferral:{nom:'sol ferrallitique', court:'ferrallitique', pluie:.8, sec:1.0, besoin:1.0, rdt:.95, desc:'argile rouge ou jaune, acide, bien drainée (socle ancien)'},
  sable:{nom:'sable blanc de savane', court:'sable blanc', pluie:.65, sec:1.5, besoin:1.3, rdt:.8, desc:'très drainant et pauvre, sèche vite (plaine côtière ancienne, série Coswine)'},
  argile:{nom:'argile marine', court:'argile marine', pluie:1.5, sec:.7, besoin:.9, rdt:1.05, desc:'fertile mais gorgée d’eau en saison des pluies (plaine côtière récente, série Demerara)'},
  pegasse:{nom:'pégasse', court:'pégasse', pluie:1.9, sec:.6, besoin:.8, rdt:.8, desc:'sol tourbeux de marais, très mal drainé et acide : buttes ou drainage indispensables'},
  alluvion:{nom:'alluvions de rivière', court:'alluvions', pluie:1.15, sec:.85, besoin:.95, rdt:1.1, desc:'fertiles, drainage moyen, risque de crue'}
};
const NODE_SOL = {cayenne:['ferral','argile'], remire:['ferral','argile'], matoury:['ferral','argile'], tonate:['sable','argile'], montsinery:['ferral','pegasse'], tonnegrande:['ferral','argile'],
  kourou:['sable','argile'], sinnamary:['sable','argile'], iracoubo:['sable','pegasse'], slm:['sable','alluvion'], javouhey:['sable','argile'], mana:['sable','argile'], awala:['sable','pegasse'],
  apatou:['ferral','alluvion'], roura:['ferral','argile'], cacao:['ferral','alluvion'], kaw:['ferral','pegasse'], regina:['ferral','alluvion'], stgeorges:['ferral','alluvion'],
  maripasoula:['ferral','alluvion'], papaichton:['ferral','alluvion'], grandsanti:['ferral','alluvion'], saul:['ferral','alluvion']};
let SOILFX = {haut:'ferral', bas:'argile', pluie:1, sec:1, besoin:1, rdt:1};
const PLANTS_IDX = {2020:100, 2023:112.3, 2024:110.7}; // IPAMPA « semences et plants », base 100 en 2020 (Agreste)
const ZONE = Object.fromEntries(ZONES.map(z=>[z.id,z]));
const MKT = Object.fromEntries(MARCHES.map(m=>[m.id,m]));
const IDX = [1.00,0.97,0.95,1.05,1.16,1.22,1.14,1.00,0.88,0.84,0.87,0.96];
const IDXM = IDX.reduce((a,b)=>a+b,0)/12;
const ABRI_AN = 3.0, ABRI_RDT = 1.3, FRET_KG = 1.6, ELAST = 0.4;
let ALEA = 0.15; // aléa de marché, recalculé sur les mercuriales dès qu'il y a assez de relevés
const PRESSION = {faible:.5, moyenne:1, forte:1.8};
const CAT_COL = {feuille:'var(--c-feuille)', fruit:'var(--c-fruit)', courge:'var(--c-courge)', racine:'var(--c-racine)'};
const CONDUITE_TXT = {sec:'plein champ sans arrosage', irrigue:'plein champ arrosé', abri:'sous abri arrosé'};
const LUNE_BONUS = .03;

/* ---------- État ---------- */
const DEF = {zone:'cayenne', lieu:{mode:'node', id:'cayenne'}, conso:10, fuel:'gazole', trips:2, place:15, usure:0.10, conduite:'sec', surface:1000, vendu:80, basse:30, mo:'smic', taux:12.31, parcelle:'', parcelles:[], plantations:[], pression:'moyenne', metric:'mois', scenario:'moyenne',
  cats:{feuille:true,fruit:true,courge:true,racine:true}, crop:'tomate', week:0, overrides:{}};
let state = JSON.parse(JSON.stringify(DEF));
const KEY = 'calendrier-maraicher-guyane-v3';
try { const s = JSON.parse(localStorage.getItem(KEY)||'null'); if (s && typeof s==='object') state = Object.assign(state, s, {week:0}); } catch(e){}
if (!ZONE[state.zone]) state.zone = 'cayenne';
if (!CROP[state.crop]) state.crop = 'tomate';
if (!PRESSION[state.pression]) state.pression = 'moyenne';
delete state.perso; delete state.tc;
if (state.defautSec !== 1){ state.conduite = 'sec'; state.defautSec = 1; }
if (!Array.isArray(state.parcelles)) state.parcelles = [];
if (!Array.isArray(state.plantations)) state.plantations = [];
if (!state.lieu || !state.lieu.mode) state.lieu = {mode:'node', id:{cayenne:'cayenne',macouria:'tonate',kourou:'kourou',ouest:'slm',cacao:'cacao',est:'regina',fleuve:'maripasoula'}[state.zone] || 'cayenne'};
if (!['essence','gazole'].includes(state.fuel)) state.fuel = 'gazole';
function save(){ try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){} window.dispatchEvent(new Event('cmg:save')); }
let OFFICIEL = {"maj":"2026-09-28","releves":[{"date":"2026-09-05","produit":"aubergine","prix":3.3},{"date":"2026-09-05","produit":"bredes","prix":6.0},{"date":"2026-09-05","produit":"chou","prix":5.0},{"date":"2026-09-05","produit":"chou_chinois","prix":4.5},{"date":"2026-09-05","produit":"cive","prix":14.4},{"date":"2026-09-05","produit":"concombre","prix":2.5},{"date":"2026-09-05","produit":"dachine","prix":4.5},{"date":"2026-09-05","produit":"gingembre","prix":10.9},{"date":"2026-09-05","produit":"giraumon","prix":3.0},{"date":"2026-09-05","produit":"gombo","prix":6.2},{"date":"2026-09-05","produit":"haricot","prix":3.6},{"date":"2026-09-05","produit":"igname","prix":4.4},{"date":"2026-09-05","produit":"laitue","prix":8.1},{"date":"2026-09-05","produit":"mais","prix":5.8},{"date":"2026-09-05","produit":"manioc","prix":2.7},{"date":"2026-09-05","produit":"melon","prix":4.3},{"date":"2026-09-05","produit":"pasteque","prix":2.0},{"date":"2026-09-05","produit":"patate","prix":3.8},{"date":"2026-09-05","produit":"persil","prix":21.0},{"date":"2026-09-05","produit":"poivron","prix":9.2},{"date":"2026-09-05","produit":"tomate","prix":6.5},{"date":"2026-09-12","produit":"aubergine","prix":3.5},{"date":"2026-09-12","produit":"bredes","prix":6.2},{"date":"2026-09-12","produit":"chou","prix":5.0},{"date":"2026-09-12","produit":"chou_chinois","prix":4.8},{"date":"2026-09-12","produit":"cive","prix":12.0},{"date":"2026-09-12","produit":"concombre","prix":2.6},{"date":"2026-09-12","produit":"dachine","prix":4.5},{"date":"2026-09-12","produit":"gingembre","prix":9.8},{"date":"2026-09-12","produit":"giraumon","prix":2.9},{"date":"2026-09-12","produit":"gombo","prix":6.4},{"date":"2026-09-12","produit":"haricot","prix":3.6},{"date":"2026-09-12","produit":"igname","prix":4.1},{"date":"2026-09-12","produit":"laitue","prix":11.1},{"date":"2026-09-12","produit":"mais","prix":5.5},{"date":"2026-09-12","produit":"manioc","prix":2.7},{"date":"2026-09-12","produit":"melon","prix":4.7},{"date":"2026-09-12","produit":"pasteque","prix":2.1},{"date":"2026-09-12","produit":"patate","prix":4.0},{"date":"2026-09-12","produit":"persil","prix":22.0},{"date":"2026-09-12","produit":"poivron","prix":9.6},{"date":"2026-09-12","produit":"tomate","prix":6.3},{"date":"2026-09-19","produit":"aubergine","prix":3.2,"min":2.0,"max":5.0,"obs":3.5},{"date":"2026-09-19","produit":"bredes","prix":6.1,"min":4.0,"max":8.0,"obs":6.0},{"date":"2026-09-19","produit":"chou","prix":4.8,"min":3.0,"max":6.0,"obs":5.0},{"date":"2026-09-19","produit":"chou_chinois","prix":4.7,"min":4.0,"max":6.0,"obs":5.0},{"date":"2026-09-19","produit":"cive","prix":12.1,"min":8.0,"max":15.0,"obs":10.0},{"date":"2026-09-19","produit":"concombre","prix":2.3,"min":1.8,"max":3.0,"obs":2.0},{"date":"2026-09-19","produit":"dachine","prix":4.4,"min":3.0,"max":5.5,"obs":4.0},{"date":"2026-09-19","produit":"gingembre","prix":10.1,"min":7.0,"max":15.0,"obs":7.0},{"date":"2026-09-19","produit":"giraumon","prix":3.0,"min":2.5,"max":4.0,"obs":2.5},{"date":"2026-09-19","produit":"gombo","prix":6.2,"min":4.0,"max":8.0,"obs":6.0},{"date":"2026-09-19","produit":"haricot","prix":3.4,"min":3.0,"max":4.0,"obs":3.0},{"date":"2026-09-19","produit":"igname","prix":4.5,"min":3.5,"max":6.0,"obs":4.0},{"date":"2026-09-19","produit":"laitue","prix":12.4,"min":8.0,"max":15.0,"obs":15.0},{"date":"2026-09-19","produit":"mais","prix":5.6,"min":5.0,"max":6.0,"obs":6.0},{"date":"2026-09-19","produit":"manioc","prix":2.9,"min":2.0,"max":3.5,"obs":3.0},{"date":"2026-09-19","produit":"melon","prix":5.2,"min":3.5,"max":6.5,"obs":5.0},{"date":"2026-09-19","produit":"pasteque","prix":1.8,"min":1.0,"max":2.5,"obs":2.0},{"date":"2026-09-19","produit":"patate","prix":3.9,"min":3.0,"max":4.8,"obs":3.5},{"date":"2026-09-19","produit":"persil","prix":23.0,"min":16.7,"max":28.0,"obs":25.0},{"date":"2026-09-19","produit":"piment","prix":14.0,"min":10.0,"max":18.0,"obs":15.0},{"date":"2026-09-19","produit":"poivron","prix":9.1,"min":5.0,"max":13.0,"obs":10.0},{"date":"2026-09-19","produit":"tomate","prix":6.1,"min":4.0,"max":10.0,"obs":6.0}],"familles":[{"date":"2026-09-19","famille":"agrumes","guyane":4.53,"cayenne":4.07,"ile_cayenne":4.83,"kourou":5.02,"stlaurent":5.25},{"date":"2026-09-19","famille":"bananes","guyane":2.99,"cayenne":2.92,"ile_cayenne":3.45,"kourou":2.98,"stlaurent":2.5},{"date":"2026-09-19","famille":"condiments","guyane":16.0,"cayenne":15.49,"ile_cayenne":17.85,"kourou":14.09,"stlaurent":16.91},{"date":"2026-09-19","famille":"fruits","guyane":4.45,"cayenne":4.11,"ile_cayenne":4.79,"kourou":4.41,"stlaurent":5.39},{"date":"2026-09-19","famille":"fruits_tropicaux","guyane":4.62,"cayenne":4.31,"ile_cayenne":5.38,"kourou":4.52,"stlaurent":5.37},{"date":"2026-09-19","famille":"legumes","guyane":6.48,"cayenne":6.2,"ile_cayenne":7.28,"kourou":5.54,"stlaurent":7.32},{"date":"2026-09-19","famille":"legumes_tropicaux","guyane":4.84,"cayenne":4.65,"ile_cayenne":5.84,"kourou":4.43,"stlaurent":4.95},{"date":"2026-09-19","famille":"total","guyane":5.67,"cayenne":5.37,"ile_cayenne":6.34,"kourou":4.99,"stlaurent":6.63},{"date":"2026-09-19","famille":"tubercules","guyane":4.67,"cayenne":4.48,"ile_cayenne":4.31,"kourou":4.68,"stlaurent":6.3}]};

/* ---------- Outils ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const nf0 = new Intl.NumberFormat('fr-FR',{maximumFractionDigits:0});
const nf1 = new Intl.NumberFormat('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1});
const nf2 = new Intl.NumberFormat('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2});
const eur = v => nf0.format(Math.round(v)) + ' €';
const pct = v => nf0.format(Math.round(v*100)) + ' %';
const sgn = v => (v>=0?'+':'−') + nf0.format(Math.abs(Math.round(v)));
const fd = d => d.getDate() + ' ' + MOIS[d.getMonth()];
const fdy = d => fd(d) + ' ' + d.getFullYear();
const JOURS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];

const isoDay = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const uid = () => Math.random().toString(36).slice(2,10);
function mondayOf(d){ const x = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12); x.setDate(x.getDate() - ((x.getDay()+6)%7)); return x; }
const START = mondayOf(new Date());
function weekDate(w){ const d = new Date(START); d.setDate(d.getDate()+7*w); return d; }
function midWeek(w){ const d = weekDate(w); d.setDate(d.getDate()+3); return d; }
function monthPos(d){ const y=d.getFullYear(); const a=new Date(y,0,1), b=new Date(y+1,0,1); return 12*(d-a)/(b-a); }
function interp12(arr, d){ const x = monthPos(d) - 0.5; const i = Math.floor(x); const f = x - i; const a = arr[(i%12+12)%12], b = arr[((i+1)%12+12)%12]; return a*(1-f) + b*f; }
function outside(v, lo, hi){ return v < lo ? lo - v : (v > hi ? v - hi : 0); }
const joursPluie = p => 27*(1 - Math.exp(-p/170));
const zone = () => ZONE[state.zone];
function eff(c, k){ const o = state.overrides[c.id]; return (o && o[k] != null && isFinite(o[k])) ? o[k] : c[k]; }

/* ---------- Emplacement de l'exploitation ---------- */
const nf3 = new Intl.NumberFormat('fr-FR',{minimumFractionDigits:3,maximumFractionDigits:3});
function hav(a1,o1,a2,o2){ const r = Math.PI/180, da = (a2-a1)*r, dO = (o2-o1)*r; const x = Math.sin(da/2)**2 + Math.cos(a1*r)*Math.cos(a2*r)*Math.sin(dO/2)**2; return 2*6371*Math.asin(Math.sqrt(x)); }
const inGuyane = (lat, lon) => lat>2 && lat<6.2 && lon>-55 && lon<-51.2;
function locate(lat, lon){
  const c0 = Math.cos(lat*Math.PI/180), X = (o)=>o*c0*111.32, Y = (a)=>a*110.57;
  let best = null;
  for (const [a,b,km] of EDGES){ const A = NODE[a], B = NODE[b];
    const ax = X(A.lon), ay = Y(A.lat), vx = X(B.lon)-ax, vy = Y(B.lat)-ay, px = X(lon), py = Y(lat), L2 = vx*vx+vy*vy;
    const t = clamp(L2 ? ((px-ax)*vx+(py-ay)*vy)/L2 : 0, 0, 1), dd = Math.hypot(ax+t*vx-px, ay+t*vy-py);
    if (!best || dd < best.dd) best = {a,b,km,t,dd}; }
  let fl = null; for (const n of NODES) if (n.fret){ const d = hav(lat,lon,n.lat,n.lon); if (!fl || d < fl.d) fl = {n,d}; }
  if (fl && best.dd > 35 && fl.d < best.dd) return {mode:'fret', zone:'fleuve', near:fl.n, access:fl.d};
  const acc = best.dd*1.3, near = best.t < .5 ? NODE[best.a] : NODE[best.b];
  return {mode:'road', zone:near.zone, near, access:acc, distTo: id => acc + Math.min(best.t*best.km + DIST[best.a][id], (1-best.t)*best.km + DIST[best.b][id])};
}
let LOC = null;
function resolveLoc(){
  const l = state.lieu; let r;
  if (l.mode==='node' && NODE[l.id]){ const n = NODE[l.id];
    r = n.fret ? {mode:'fret', zone:n.zone, near:n, access:0} : {mode:'road', zone:n.zone, near:n, access:0, distTo: id => DIST[n.id][id]};
    r.label = n.nom; }
  else if ((l.mode==='gps' || l.mode==='coords') && isFinite(l.lat) && isFinite(l.lon) && inGuyane(l.lat, l.lon)){
    r = locate(l.lat, l.lon); r.label = `${l.mode==='gps'?'Position GPS':'Coordonnées'} ${nf3.format(l.lat)}, ${nf3.format(l.lon)} · près de ${r.near.nom}`; }
  else { state.lieu = {mode:'node', id:'cayenne'}; return resolveLoc(); }
  r.dist = {}; for (const m of MARCHES) r.dist[m.id] = m.local ? 0 : (r.mode==='road' ? r.distTo(MARKET_NODE[m.id]) : null);
  LOC = r; state.zone = r.zone;
  const [sh, sb] = NODE_SOL[r.near.id] || ['ferral','argile'], b = state.basse/100, mix = k => (1-b)*SOLS[sh][k] + b*SOLS[sb][k];
  SOILFX = {haut:sh, bas:sb, pluie:mix('pluie'), sec:mix('sec'), besoin:mix('besoin'), rdt:mix('rdt')};
}

/* ---------- Carburant : prix préfectoral + tendance des 5 dernières années ---------- */
const FUEL = {};
function computeFuel(){
  for (const type of ['essence','gazole']){
    const s = Object.entries(CARBU.mois).map(([k,v])=>({k, t:+k.slice(0,4) + (+k.slice(5,7)-1)/12, v:+v[type]})).filter(x=>x.v>0).sort((a,b)=>a.t-b.t);
    const last = s[s.length-1], win = s.filter(x=>x.t > last.t - 5.75), first = win[0];
    const years = {}; win.forEach(x=>{ const y = Math.floor(x.t+1e-9); (years[y] = years[y] || []).push(x.v); });
    const pts = Object.entries(years).map(([y,a])=>[+y, a.reduce((p,q)=>p+q,0)/a.length]);
    const n = pts.length, mx = pts.reduce((q,p)=>q+p[0],0)/n, my = pts.reduce((q,p)=>q+p[1],0)/n;
    let num = 0, den = 0; pts.forEach(([x,y])=>{ num += (x-mx)*(y-my); den += (x-mx)**2; });
    FUEL[type] = {last, first, pts, slope: den ? num/den : 0, n:s.length};
  }
}
function fuelAt(type, d){ const m = FUEL[type]; const t = d.getFullYear() + (d.getMonth() + d.getDate()/31)/12; return Math.max(.8*m.last.v, m.last.v + m.slope*Math.max(0, t - m.last.t)); }
const moisCle = k => MOIS[+k.slice(5,7)-1] + ' ' + k.slice(0,4);

/* ---------- Séries climatiques par zone ---------- */
const SER = {};
function stationMonths(id){
  const ann = CLIMAT.stations[id].annees, out = {};
  for (const y of Object.keys(ann).map(Number)) for (let m=0;m<12;m++){ const v = ann[y]; if (v.p[m]!=null && v.t[m]!=null && v.x[m]!=null) out[y*12+m] = {p:v.p[m], t:v.t[m], x:v.x[m]}; }
  return out;
}
const moisAbs = A => MOIS[((A%12)+12)%12] + ' ' + Math.floor(A/12);
function series(zid){
  if (SER[zid]) return SER[zid];
  const st = ZONE[zid].st, sm = st.map(stationMonths);
  let E = Math.min(...sm.map(o=>Math.max(...Object.keys(o).map(Number))));
  while (E > 0 && sm.some(o=>!o[E])) E--;
  const S = E - NM + 1, r = {p:[],t:[],x:[],S,E,s0:((S%12)+12)%12};
  for (let i=0;i<NM;i++){ const A = S+i; for (const k of ['p','t','x']){ let v=0,n=0; for (const o of sm){ const q = o[A] || o[A-12] || o[A+12]; if (q){ v+=q[k]; n++; } } r[k][i] = n ? v/n : 0; } }
  const byM = k => Array.from({length:12},(_,m)=>{ const a=[]; for (let i=0;i<NM;i++) if ((S+i)%12===m) a.push(r[k][i]); return a; });
  const P = byM('p'), T = byM('t'), X = byM('x'), mean = a => a.reduce((x,y)=>x+y,0)/a.length;
  r.mp = P.map(mean); r.mt = T.map(mean); r.mx = X.map(mean); r.minp = P.map(a=>Math.min(...a)); r.maxp = P.map(a=>Math.max(...a));
  r.ann = Array.from({length:NY},(_,j)=>r.p.slice(j*12,j*12+12).reduce((a,b)=>a+b,0));
  const n = st.map(id=>NORM[id]);
  r.np = Array.from({length:12},(_,m)=> n.reduce((q,v)=>q+v.p[m],0)/n.length);
  r.nt = n.every(v=>v.t) ? Array.from({length:12},(_,m)=> n.reduce((q,v)=>q+v.t[m],0)/n.length) : null;
  let hot = null; const y0 = Math.floor(S/12), y1 = Math.floor(E/12);
  for (let y=y0; y<=y1; y++){ const ts = []; for (let m=0;m<12;m++){ const A=y*12+m; const qs = sm.map(o=>o[A]).filter(Boolean); if (qs.length===sm.length) ts.push(qs.reduce((q,v)=>q+v.t,0)/qs.length); } if (ts.length===12){ const t = mean(ts); if (!hot || t>hot.t) hot = {y,t}; } }
  r.hot = hot; r.label = moisAbs(S) + ' – ' + moisAbs(E);
  return SER[zid] = r;
}
/* Climat de la semaine w dans le scénario k : k-ième des 10 années de la fenêtre glissante */
const climCache = new Map();
function clim(w, k){
  const key = state.zone+':'+k+':'+w; let r = climCache.get(key); if (r) return r;
  const s = series(state.zone), d = midWeek(w);
  const base = ((START.getMonth() - s.s0) % 12 + 12) % 12;
  const x = base + (d.getFullYear()*12 + monthPos(d)) - (START.getFullYear()*12 + START.getMonth()) + k*12 - 0.5;
  const i = Math.floor(x), f = x - i, N = NM;
  const g = (a, j) => a[((j%N)+N)%N];
  const lin = a => g(a,i)*(1-f) + g(a,i+1)*f;
  const p = lin(s.p), jours = joursPluie(p);
  r = {pluie:p, jours, tmoy:lin(s.t), tmax:lin(s.x), hr:72+.6*jours, pluieSem:p*7/30.44};
  climCache.set(key, r); return r;
}

/* ---------- Pâques / Pentecôte ---------- */
function paques(y){ const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1; return new Date(y,mo-1,da,12); }
const PQ = {};
function fete(d){ const y = d.getFullYear(); const e = PQ[y] || (PQ[y] = paques(y)); const diff = Math.round((d-e)/86400000); if (diff>=-10 && diff<=1) return 1.25; if (diff>=43 && diff<=50) return 1.10; return 1; }

/* ---------- Prix ---------- */
function saison(c, m, d){ return (1 + c.amp*m.amp*(interp12(IDX,d)/IDXM - 1)) * (c.paques ? fete(d) : 1); }
let CAL = {};
/* Mercuriales DAAF : prix moyen Guyane par produit + prix moyen par famille dans chaque marché.
   Marché de l'appli -> colonne DAAF ; culture -> famille DAAF utilisée pour l'écart entre marchés. */
const MKT_DAAF = {cayenne:'cayenne', remire:'ile_cayenne', matoury:'ile_cayenne', kourou:'kourou', stlaurent:'stlaurent'};
const FAM_DAAF = {cive:'condiments', persil:'condiments', piment:'condiments', patate:'tubercules', dachine:'tubercules', igname:'tubercules', manioc:'tubercules', melon:'fruits', pasteque:'fruits', gingembre:'fruits'};
let RATIO = {}, DERNIER = {};
MARCHES.forEach(m=>{ m.mult0 = m.mult; });
function buildRatios(){
  RATIO = {}; const now = Date.now(), acc = {};
  for (const f of OFFICIEL.familles||[]){ const d = new Date(f.date+'T12:00:00'); if (isNaN(d) || !(+f.guyane>0)) continue;
    const w = Math.pow(.5, Math.max(0, now-d)/DEMI_VIE);
    for (const mid in MKT_DAAF){ const v = +f[MKT_DAAF[mid]]; if (!(v>0)) continue;
      const a = (acc[f.famille] = acc[f.famille] || {}); const o = (a[mid] = a[mid] || {s:0,w:0}); o.s += w*v/f.guyane; o.w += w; } }
  for (const fam in acc){ RATIO[fam] = {}; for (const mid in acc[fam]) RATIO[fam][mid] = acc[fam][mid].s/acc[fam][mid].w; }
  const L = RATIO.legumes; MARCHES.forEach(m=>{ m.mult = (L && L.cayenne && L[m.id]) ? L[m.id]/L.cayenne : m.mult0; });
}
function ratioMarche(c, mid){ const r = RATIO[FAM_DAAF[c.id] || 'legumes'] || RATIO.legumes; return r && r[mid] ? r[mid] : null; }
const DEMI_VIE = 2*365.25*86400000; // un relevé vieux de deux ans compte moitié moins qu'un relevé récent
function buildCal(){
  buildRatios(); CAL = {}; DERNIER = {}; const groups = {}, now = Date.now(), res = [];
  const add = (c, m, p, d) => (groups[c.id+'|'+m.id] = groups[c.id+'|'+m.id] || []).push({d,p,c,m,w:Math.pow(.5, Math.max(0, now-d)/DEMI_VIE)});
  const ventes = (state.plantations||[]).flatMap(x=>(x.ventes||[]).map(v=>({date:v.date, marche:v.marche, produit:x.culture, prix:v.prix})));
  for (const r of [].concat(OFFICIEL.releves||[], ventes)){
    const c = CROP[r.produit], p = +r.prix, d = new Date(r.date+'T12:00:00');
    if (!c || !(p>0) || isNaN(d)) continue;
    if (r.marche && r.marche !== 'guyane'){ const m = MKT[r.marche]; if (m) add(c, m, p, d); continue; }
    // Prix moyen Guyane -> prix de chaque marché selon l'écart relevé par la DAAF pour la famille du produit
    if (!DERNIER[c.id] || d > DERNIER[c.id].d) DERNIER[c.id] = {d, prix:p, min:+r.min||null, max:+r.max||null, obs:+r.obs||null};
    for (const mid in MKT_DAAF){ const q = ratioMarche(c, mid); add(c, MKT[mid], p*(q != null ? q : MKT[mid].mult0), d); }
  }
  for (const k in groups){
    const g = groups[k], c = g[0].c, m = g[0].m, W = g.reduce((s,x)=>s+x.w,0);
    const level = g.reduce((s,x)=>s + x.w*x.p/saison(c,m,x.d),0)/W;
    const months = Array.from({length:12},()=>({s:0,w:0})); g.forEach(x=>{ const o = months[x.d.getMonth()]; o.s += x.w*x.p; o.w += x.w; });
    const covered = months.filter(o=>o.w>0).length;
    const monthly = covered>=9 ? months.map((o,i)=> o.w ? o.s/o.w : level*saison(c,m,new Date(2026,i,15,12))) : null;
    const last = g.reduce((a,b)=> b.d>a.d ? b : a);
    (CAL[c.id] = CAL[c.id] || {})[m.id] = {n:g.length, level, monthly, last:{date:last.d, prix:last.p}};
    if (g.length >= 8) g.forEach(x=>res.push(x.p/(level*saison(c,m,x.d)) - 1));
  }
  if (res.length >= 40){ const mu = res.reduce((a,b)=>a+b,0)/res.length; ALEA = clamp(Math.sqrt(res.reduce((a,b)=>a+(b-mu)**2,0)/res.length), .05, .4); } else ALEA = .15;
}
function baseEstim(c){
  const o = state.overrides[c.id]; if (o && o.prix != null) return o.prix;
  return baseReel(c);
}
function baseReel(c){ // prix moyen annuel à Cayenne : mercuriales si disponibles, sinon estimation de départ
  const cal = CAL[c.id]; if (cal && cal.cayenne && cal.cayenne.n >= 3) return cal.cayenne.level;
  if (cal){ let s=0,n=0; for (const mid in cal){ if (mid==='local') continue; s += cal[mid].level/MKT[mid].mult*cal[mid].n; n += cal[mid].n; } if (n>=3) return s/n; }
  return c.prix;
}
const priceCache = new Map();
function priceW(c, m, w){
  const key = c.id+'|'+m.id+'|'+w; let v = priceCache.get(key); if (v != null) return v;
  const d = midWeek(w), base = baseEstim(c), cal = CAL[c.id] && CAL[c.id][m.id];
  if (m.local){ const ref = CAL[c.id] && CAL[c.id].local; v = (ref && ref.n>=3 ? ref.level : base*zone().local)*saison(c,m,d); }
  else if (cal && cal.monthly) v = interp12(cal.monthly, d);
  else v = ((cal && cal.n>=3) ? cal.level : base*m.mult)*saison(c,m,d);
  priceCache.set(key, v); return v;
}
function source(c, m){ const cal = CAL[c.id] && CAL[c.id][m.id]; return cal && cal.n>=3 ? 'reel' : 'estim'; }
function marketPrices(c, h0, h1){
  return MARCHES.map(m=>{ let s=0; for (let k=h0;k<=h1;k++) s += priceW(c,m,k); return {m, prix:s/(h1-h0+1), src:source(c,m)}; });
}

/* ---------- Lune (calculée pour les dates réelles) ---------- */
const SYN = 29.530588853, REFNM = Date.UTC(2000,0,6,18,14);
function moonAge(d){ const x = (d.getTime()-REFNM)/86400000; return ((x%SYN)+SYN)%SYN; }
function moonFav(c, d){ const a = moonAge(d); return c.lune==='bas' ? (a>=16.3 && a<=28.0) : (a>=1.5 && a<=13.3); }
function phaseNom(a){ const n=['Nouvelle lune','Premier croissant','Premier quartier','Gibbeuse croissante','Pleine lune','Gibbeuse décroissante','Dernier quartier','Dernier croissant']; return n[Math.floor((a/SYN)*8+0.5)%8]; }
function favFrac(c, w){ let n=0; for (let i=0;i<7;i++){ const d = weekDate(w); d.setDate(d.getDate()+i); if (moonFav(c,d)) n++; } return n/7; }
function sowDay(c, w){ // jour de plantation conseillé : 1er jour favorable de la semaine, sinon le plus proche (±4 j)
  for (let i=0;i<7;i++){ const d = weekDate(w); d.setDate(d.getDate()+i); if (moonFav(c,d)) return {d, fav:true}; }
  for (let off=1; off<=4; off++) for (const sg of [-1,1]){ const d = weekDate(w); d.setDate(d.getDate() + (sg<0 ? -off : 6+off)); if (d >= weekDate(0) && moonFav(c,d)) return {d, fav:true, hors:true}; }
  return {d: weekDate(w), fav:false};
}
function moonSVG(a, size){
  const r = size/2 - 1, cx = size/2, cy = size/2, ph = a/SYN, k = Math.cos(2*Math.PI*ph), wax = ph < .5, rx = Math.abs(k)*r;
  const inner = wax ? (k>0?0:1) : (k>0?1:0);
  const lit = `M${cx} ${cy-r} A${r} ${r} 0 0 ${wax?1:0} ${cx} ${cy+r} A${rx.toFixed(2)} ${r} 0 0 ${inner} ${cx} ${cy-r}Z`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle cx="${cx}" cy="${cy}" r="${r}" style="fill:var(--moon-dark)"/><path d="${lit}" style="fill:var(--moon-lit)"/></svg>`;
}

/* ---------- Simulation d'une plantation pour une année climatique ---------- */
function simulate(c, p, k){
  const abri = state.conduite==='abri' && c.abri, irrig = state.conduite!=='sec';
  const cycle = eff(c,'cycle'); let prog = 0, w = p;
  while (prog < 1 && w < p+90){ const cl = clim(w,k); const low = clamp((cl.jours-8)/18,0,1); const tf = 1 + .04*outside(cl.tmoy+(abri?1.5:0), c.tmin, c.tmax); prog += 7/(cycle*(1+(abri?.06:.12)*low)*tf); w++; }
  const g = w - p, h0 = w, h1 = h0 + c.recS - 1;
  let sp=0, sh=0, ss=0, st=0, ws=0, irrMm=0;
  for (let q=p; q<=h1; q++){
    const cl = clim(q,k), harv = q>=h0, late = !harv && (q-p) >= .6*g, wt = (harv||late) ? 1.5 : 1;
    let lp = Math.min(.9, c.sP*SOILFX.pluie*Math.min(.85, .7*Math.max(0, cl.pluie - c.pluieMax)/c.pluieMax)); if (abri) lp *= .25;
    let lh = c.sH*Math.max(0, cl.hr-80)/10*.35; if (abri) lh *= .6;
    const bes = c.besoin*SOILFX.besoin, def = Math.max(0, bes - .8*cl.pluie);
    let ls = 0; if (irrig) irrMm += def*7/30.44; else ls = Math.min(.9, c.sS*SOILFX.sec*Math.min(.9, def/bes)*.9);
    const lt = Math.min(.6, .06*Math.max(0, cl.tmax+(abri?2:0)-c.tcrit) + .04*outside(cl.tmoy+(abri?1.5:0), c.tmin, c.tmax));
    sp += wt*lp; sh += wt*lh; ss += wt*ls; st += wt*lt; ws += wt;
  }
  const L = {pluie:sp/ws, hum:sh/ws, sec:ss/ws, chaleur:st/ws, anim:Math.min(.6, eff(c,'anim')*PRESSION[state.pression])};
  const rdtPot = eff(c,'rdt')*(abri?ABRI_RDT:1)*SOILFX.rdt*(PERSO_F[c.id] ? PERSO_F[c.id].f : 1);
  const rdt = Math.max(.03*rdtPot, rdtPot*(1-L.pluie)*(1-L.hum)*(1-L.sec)*(1-L.chaleur)*(1-L.anim)*rotation(c,p).f);
  return {g,h0,h1,occ:h1-p+1,L,rdt,rdtPot,irrMm,abri,irrig};
}
/* Saisons analogues pondérées selon El Niño / La Niña annoncé */
const rotCache = new Map(), PERSO_F = {};
function seasonKey(A){ const y = Math.floor(A/12), m = ((A%12)+12)%12, y0 = m >= 6 ? y : y-1; return y0 + '-' + String(y0+1).slice(2); }
function ensoW(d){
  const s = series(state.zone), pv = ENSO && ENSO.prevision, base = ((START.getMonth() - s.s0) % 12 + 12) % 12;
  const keys = Array.from({length:NY},(_,k)=>seasonKey(s.S + base + 12*k)), uni = Array(NY).fill(1/NY);
  if (!pv) return {w:uni, alpha:0, keys};
  const [ey, em] = pv.emission.split('-').map(Number), [hy, hm] = pv.horizon.split('-').map(Number);
  const mH = (d.getFullYear()-ey)*12 + (d.getMonth()+1) - em, H = (hy-ey)*12 + hm - em;
  const alpha = clamp(pv.confiance||0, 0, 1) * clamp(1 - (mH - H)/4, 0, 1);
  const raw = keys.map(k=> ENSO.saisons[k]==null ? 0 : Math.exp(-((ENSO.saisons[k]-pv.oni)**2)/(2*.8*.8)));
  const S = raw.reduce((a,b)=>a+b,0);
  if (!S || alpha <= 0) return {w:uni, alpha:0, keys};
  return {w: raw.map(r=> alpha*r/S + (1-alpha)/NY), alpha, keys};
}
const topSaisons = (w, keys) => keys.map((k,i)=>({k, w:w[i]})).sort((a,b)=>b.w-a.w).filter(x=>x.w>.12).slice(0,3).map(x=>x.k).join(', ');
/* Rotation : ce qui a déjà poussé sur la parcelle choisie */
function rotation(c, p){
  const key = c.id+'|'+p; let r = rotCache.get(key); if (r) return r;
  r = {f:1, note:''};
  if (state.parcelle){ const d = weekDate(p);
    for (const x of state.plantations){ if (x.parcelle !== state.parcelle) continue;
      const pc = CROP[x.culture], dx = new Date(x.date+'T12:00:00'); if (!pc || !(dx < d)) continue;
      const mo = (d - dx)/(30.44*86400000);
      if (pc.fam === c.fam){ let pen = 0, why = '';
        if (c.fam==='solanacees' && mo < 24){ pen = .35*(1 + .3*state.basse/100); why = 'risque de flétrissement bactérien et de nématodes'; }
        else if (c.fam==='cucurbitacees' && mo < 12){ pen = .2; why = 'risque de fusariose et de nématodes'; }
        else if (c.fam==='brassicacees' && mo < 12){ pen = .15; why = 'risque de hernie et de ravageurs du chou'; }
        else if (mo < 6){ pen = .1; why = 'sol fatigué par la même famille'; }
        if (pen && x.culture===c.id) pen += .05;
        if (pen && 1-pen < r.f) r = {f:1-pen, note:`${pc.nom} planté(e) sur cette parcelle le ${fd(dx)} : ${why}`};
      } else if (pc.fam==='fabacees' && mo < 8 && r.f >= 1) r = {f:1.05, note:`haricot planté ici le ${fd(dx)} : le sol est enrichi en azote`};
    } }
  rotCache.set(key, r); return r;
}
/* Vos récoltes notées recalent le rendement du modèle pour votre ferme */
function persoFactor(c){
  const xs = (state.plantations||[]).filter(x=>x.culture===c.id && x.recolteKg>0 && x.predRdt>0 && x.surface>0).map(x=>(x.recolteKg/x.surface)/x.predRdt);
  if (!xs.length) return {f:1, n:0};
  const m = xs.reduce((a,b)=>a+b,0)/xs.length, n = xs.length;
  return {f: clamp(1 + (m-1)*n/(n+2), .3, 2), n, brut:m};
}
/* Hausse du prix des semences et plants (hors engrais) */
function plantsIdx(d){
  const pts = Object.entries(PLANTS_IDX).map(([y,v])=>[+y+.5, v]), n = pts.length, mx = pts.reduce((q,p)=>q+p[0],0)/n, my = pts.reduce((q,p)=>q+p[1],0)/n;
  let num = 0, den = 0; pts.forEach(([x,y])=>{ num += (x-mx)*(y-my); den += (x-mx)**2; });
  const sl = den ? num/den : 0, last = pts[n-1];
  return {v: last[1] + sl*(d.getFullYear() + d.getMonth()/12 - last[0]), sl, pct: sl/last[1]};
}
const PLANTS_REF = plantsIdx(new Date(2026,5,15)).v;

/* Agrégation : saisons pondérées × 3 situations de marché */
function aggregate(c, p){
  const sims = []; for (let k=0;k<NY;k++) sims.push(simulate(c,p,k));
  const EW = ensoW(midWeek(Math.round(sims.reduce((q,x)=>q+x.h0,0)/NY))), W = EW.w;
  const meanS = f => sims.reduce((q,x,i)=>q+W[i]*f(x),0);
  const L = {pluie:meanS(x=>x.L.pluie), hum:meanS(x=>x.L.hum), sec:meanS(x=>x.L.sec), chaleur:meanS(x=>x.L.chaleur), anim:sims[0].L.anim};
  const h0 = Math.round(meanS(x=>x.h0)), h1 = h0 + c.recS - 1, rdtM = meanS(x=>x.rdt), vendu = state.vendu/100;
  const dH = midWeek(Math.round((h0+h1)/2)), fuelP = fuelAt(state.fuel, dH), gazP = fuelAt('gazole', dH);
  const soldKg = Math.max(1, rdtM*vendu*state.surface), trips = c.recS*state.trips, taux = state.mo==='smic' ? state.taux : 0;
  const mk = marketPrices(c, h0, h1).map(x=>{
    const km = LOC.dist[x.m.id]; let trTot = 0, hV = 0;
    if (x.m.local) hV = 2*c.recS;
    else if (LOC.mode==='fret'){ trTot = FRET_KG*soldKg + trips*state.place; hV = trips*6; }
    else { trTot = trips*(2*km*(state.conso/100*fuelP + state.usure) + state.place); hV = trips*(2*km/50 + 4); }
    return Object.assign(x, {km, trips: x.m.local ? 0 : trips, trTot, hV, tr: trTot/soldKg, net: x.prix - (trTot + hV*taux)/soldKg}); });
  const best = mk.reduce((a,b)=> b.net>a.net ? b : a);
  const prixEau = .25*gazP + .20; // €/m³ pompé au gazole
  const plF = plantsIdx(weekDate(p)).v/PLANTS_REF, intr = eff(c,'cout') - eff(c,'pl') + eff(c,'pl')*plF;
  const heures = eff(c,'h')*state.surface/100 + best.hV, mo = heures*taux/state.surface;
  const chocs = [-ALEA, 0, ALEA], scen = [];
  sims.forEach((x,i)=>{
    const pf = clamp(Math.pow(rdtM/x.rdt, ELAST), .75, 1.5);
    const eau = x.irrMm/1000*prixEau, abriC = x.abri ? ABRI_AN*x.occ/52 : 0, cout = intr + eau + abriC;
    const tr = best.m.local ? 0 : (LOC.mode==='fret' ? FRET_KG*x.rdt*vendu + trips*state.place/state.surface : best.trTot/state.surface);
    for (const ch of chocs){ const recette = x.rdt*vendu*best.prix*pf*(1+ch), marge = recette - tr - cout - mo;
      scen.push({x, w:W[i]/3, ch, recette, cout, eau, abriC, tr, marge, parMois: marge/(x.occ/4.345)}); }
  });
  const mean = f => scen.reduce((q,y)=>q+y.w*f(y),0);
  const quant = (f, q) => { const a = scen.map(y=>({v:f(y), w:y.w, y})).sort((u,v)=>u.v-v.v); let cum = 0; for (const it of a){ cum += it.w; if (cum >= q - 1e-9) return it; } return a[a.length-1]; };
  const mv = state.metric==='mois' ? (y=>y.parMois) : (y=>y.marge);
  const val = state.scenario==='prudent' ? quant(mv,.2).v : mean(mv);
  const badIt = quant(y=>y.marge,.2), bad = badIt.y;
  const cause = bad.x.rdt < .85*rdtM && bad.ch >= 0 ? 'mauvaise récolte (météo)' : (bad.ch < 0 && bad.x.rdt >= .85*rdtM ? 'prix bas (marché saturé ou importations)' : 'météo et prix défavorables');
  const lf = favFrac(c, p), perte = scen.reduce((q,y)=>q+(y.marge<0?y.w:0),0);
  let si = 0; for (let q=h0;q<=h1;q++) si += saison(c, MKT.cayenne, midWeek(q)); si /= c.recS;
  const cout = mean(y=>y.cout), tr = mean(y=>y.tr), marge = mean(y=>y.marge);
  return {c, p, h0, h1, occ:h1-p+1, g:h0-p, L, sims, scen, W, ensoA:EW.alpha, ensoTop:topSaisons(W, EW.keys),
    rdt:rdtM, rdtPot:sims[0].rdtPot, cout, plF, coutEau:mean(y=>y.eau), coutAbri:mean(y=>y.abriC), tr, mo, heures, taux, recette:mean(y=>y.recette),
    marge, parMois:mean(y=>y.parMois), margeP20:badIt.v, parMoisP20:quant(y=>y.parMois,.2).v,
    minMarge:Math.min(...scen.map(y=>y.marge)), maxMarge:Math.max(...scen.map(y=>y.marge)),
    nPerte:Math.round(perte*10), rentables:Math.round((1-perte)*10), cause,
    remH: heures > 0 ? (marge + mo)*state.surface/heures : 0,
    prixRevient:(cout + tr + mo)/Math.max(.01, rdtM*vendu), mk, best, si, lf, val, fuelP, trips, rot:rotation(c,p), perso:PERSO_F[c.id],
    score: val + Math.abs(val)*LUNE_BONUS*(2*lf-1),
    abri:sims[0].abri, noAbri:state.conduite==='abri' && !c.abri, dureeJ:Math.round(meanS(x=>x.g)*7)};
}
/* Pluie attendue pour le mois i après le mois courant, pondérée par la saison annoncée */
function expectedMonth(i){
  const s = series(state.zone), base = ((START.getMonth() - s.s0) % 12 + 12) % 12, d = new Date(START.getFullYear(), START.getMonth()+i, 15, 12), EW = ensoW(d);
  let v = 0; for (let k=0;k<NY;k++) v += EW.w[k]*s.p[((base + i + 12*k) % NM + NM) % NM];
  return {d, v, alpha:EW.alpha};
}
let GRID = {};
function computeAll(){
  climCache.clear(); priceCache.clear(); rotCache.clear(); GRID = {};
  for (const c of CULTURES) PERSO_F[c.id] = persoFactor(c);
  for (const c of CULTURES){ const arr = []; for (let p=0;p<52;p++) arr.push(aggregate(c,p)); GRID[c.id] = arr; }
}
function bestWeek(id){ const a = GRID[id]; let b = 0; for (let i=1;i<52;i++) if (a[i].score > a[b].score) b = i; return b; }
const visible = () => CULTURES.filter(c=>state.cats[c.cat]);
const total = v => v*state.surface;

/* ---------- Réglages ---------- */
function initControls(){
  $('#lieu').innerHTML = ZONES.map(z=>`<optgroup label="${esc(z.nom)}">${NODES.filter(n=>n.zone===z.id).map(n=>`<option value="${n.id}">${esc(n.nom)}</option>`).join('')}</optgroup>`).join('') + '<option value="__pos" hidden>Position choisie</option>';
  $('#cats').innerHTML = Object.entries(CATS).map(([k,v])=>`<button type="button" class="chip" data-v="${k}"><span class="cat-dot" style="background:${CAT_COL[k]}"></span>${esc(v.nom)}</button>`).join('');
  $('#dCrop').innerHTML = Object.entries(CATS).map(([k,v])=>`<optgroup label="${esc(v.nom)}">${CULTURES.filter(c=>c.cat===k).map(c=>`<option value="${c.id}">${esc(c.nom)}</option>`).join('')}</optgroup>`).join('');
  $('#lieu').addEventListener('change', e=>{ if (e.target.value==='__pos') return; state.lieu = {mode:'node', id:e.target.value}; update(); });
  const setPos = (mode, lat, lon) => { if (!inGuyane(lat, lon)){ $('#lieuInfo').textContent = 'Cette position est hors de Guyane : choisissez votre commune dans la liste.'; return; } state.lieu = {mode, lat, lon}; update(); };
  $('#gps').addEventListener('click', ()=>{
    const fail = () => { $('#lieuInfo').textContent = 'Localisation indisponible ici. Elle fonctionne dans l’appli installée sur votre téléphone ; sinon choisissez votre commune ou saisissez vos coordonnées.'; };
    try { if (!navigator.geolocation) return fail(); $('#lieuInfo').textContent = 'Recherche de votre position…';
      navigator.geolocation.getCurrentPosition(pos=>setPos('gps', pos.coords.latitude, pos.coords.longitude), fail, {enableHighAccuracy:true, timeout:15000, maximumAge:600000}); } catch(e){ fail(); }
  });
  $('#coordGo').addEventListener('click', ()=>{ const num = v => parseFloat(String(v).replace(',','.').replace(/[^0-9.\-]/g,'')); setPos('coords', num($('#lat').value), num($('#lon').value)); });
  const seg = (id, key) => $(id).addEventListener('click', e=>{ const b = e.target.closest('button'); if (!b) return; state[key] = b.dataset.v; update(); });
  seg('#conduite','conduite'); seg('#fuel','fuel'); seg('#mo','mo'); seg('#metric','metric'); seg('#scenario','scenario'); seg('#pression','pression');
  $('#cats').addEventListener('click', e=>{ const b = e.target.closest('button'); if (!b) return; const k=b.dataset.v; const on = Object.values(state.cats).filter(Boolean).length; if (state.cats[k] && on===1) return; state.cats[k] = !state.cats[k]; if (!state.cats[CROP[state.crop].cat]) state.crop = visible()[0].id; update(); });
  let t; const deb = fn => { clearTimeout(t); t = setTimeout(fn, 300); };
  const curParc = () => state.parcelles.find(q=>q.id===state.parcelle);
  $('#surface').addEventListener('input', e=>{ const v = parseFloat(e.target.value); if (v>0){ state.surface = v; const pc = curParc(); if (pc) pc.surface = v; deb(update); } });
  $('#basse').addEventListener('input', e=>{ state.basse = +e.target.value; $('#basseV').textContent = state.basse+' %'; const pc = curParc(); if (pc) pc.basse = state.basse; deb(update); });
  $('#parcSel').addEventListener('change', e=>{ state.parcelle = e.target.value; const pc = curParc(); if (pc){ state.surface = pc.surface; state.basse = pc.basse; } update(); });
  $('#plCult').innerHTML = Object.entries(CATS).map(([k,v])=>`<optgroup label="${esc(v.nom)}">${CULTURES.filter(c=>c.cat===k).map(c=>`<option value="${c.id}">${esc(c.nom)}</option>`).join('')}</optgroup>`).join('');
  $('#plDate').value = isoDay(new Date());
  $('#pBasse').addEventListener('input', e=> $('#pBasseV').textContent = e.target.value+' %');
  $('#parcForm').addEventListener('submit', e=>{ e.preventDefault(); const nom = $('#pNom').value.trim(), surf = parseFloat($('#pSurf').value), b = +$('#pBasse').value;
    if (!nom || !(surf>0)) return; const id = uid(); state.parcelles.push({id, nom, surface:surf, basse:b}); state.parcelle = id; state.surface = surf; state.basse = b; $('#pNom').value = ''; $('#pSurf').value = ''; update(); });
  $('#plForm').addEventListener('submit', e=>{ e.preventDefault(); const parc = $('#plParc').value, P = state.parcelles.find(q=>q.id===parc);
    if (!P){ $('#plMsg').textContent = 'Ajoutez d’abord une parcelle à gauche.'; $('#pNom').focus(); return; }
    const cult = $('#plCult').value, date = $('#plDate').value || isoDay(new Date()), surf = parseFloat($('#plSurf').value) || P.surface;
    const keep = {parcelle:state.parcelle, surface:state.surface, basse:state.basse};
    state.parcelle = parc; state.surface = surf; state.basse = P.basse; resolveLoc(); rotCache.clear(); priceCache.clear();
    const pw = Math.round((new Date(date+'T12:00:00') - START)/(7*86400000)), sm = aggregate(CROP[cult], pw);
    state.plantations.push({id:uid(), parcelle:parc, culture:cult, date, surface:surf, predRdt: sm.rdt/(PERSO_F[cult] ? PERSO_F[cult].f : 1), recolteDate: isoDay(weekDate(sm.h0)), ventes:[]});
    Object.assign(state, keep);
    $('#plMsg').textContent = `${CROP[cult].nom} noté(e) sur « ${P.nom} ». Récolte prévue vers le ${fd(weekDate(sm.h0))}, environ ${nf0.format(sm.rdt*surf)} kg.`; update(); });
  $('#carnet').addEventListener('click', e=>{ const b = e.target.closest('[data-act]'); if (!b) return; const id = b.dataset.id, act = b.dataset.act;
    const confirm2 = () => { if (b.dataset.ok==='1') return true; b.dataset.ok = '1'; b.textContent = 'Confirmer la suppression'; return false; };
    if (act==='usep'){ const pc = state.parcelles.find(q=>q.id===id); if (pc){ state.parcelle = id; state.surface = pc.surface; state.basse = pc.basse; update(); } }
    else if (act==='delp'){ if (!confirm2()) return; state.parcelles = state.parcelles.filter(q=>q.id!==id); state.plantations = state.plantations.filter(x=>x.parcelle!==id); if (state.parcelle===id) state.parcelle = ''; update(); }
    else if (act==='delpl'){ if (!confirm2()) return; state.plantations = state.plantations.filter(x=>x.id!==id); update(); }
    else if (act==='rec'){ const kg = parseFloat(b.closest('.act').querySelector('[data-in="kg"]').value), x = state.plantations.find(q=>q.id===id); if (x && kg>=0){ x.recolteKg = kg; update(); } }
    else if (act==='vente'){ const row = b.closest('.act'), kg = parseFloat(row.querySelector('[data-in="vkg"]').value), prix = parseFloat(String(row.querySelector('[data-in="vprix"]').value).replace(',','.')), x = state.plantations.find(q=>q.id===id);
      if (x && kg>0 && prix>0){ (x.ventes = x.ventes || []).push({date:isoDay(new Date()), kg, prix, marche:row.querySelector('[data-in="vmar"]').value}); update(); } }
  });
  $('#vendu').addEventListener('input', e=>{ const v = parseFloat(e.target.value); if (v>=10 && v<=100){ state.vendu = v; deb(update); } });
  const numIn = (id, key, lo, hi) => $('#'+id).addEventListener('input', e=>{ const v = parseFloat(String(e.target.value).replace(',','.')); if (v>=lo && v<=hi){ state[key] = v; deb(update); } });
  numIn('taux','taux',0,300); numIn('conso','conso',2,60); numIn('trips','trips',1,14); numIn('place','place',0,500); numIn('usure','usure',0,2);
  $('#dCrop').addEventListener('change', e=>{ state.crop = e.target.value; state.week = bestWeek(state.crop); renderDetail(); markHeatSel(); save(); });
  $('#dWeek').addEventListener('input', e=>{ state.week = +e.target.value; renderDetail(); markHeatSel(); });
  $('#goBest').addEventListener('click', ()=>{ state.week = bestWeek(state.crop); renderDetail(); markHeatSel(); });
  $('#jePlante').addEventListener('click', ()=>{ $('#plCult').value = state.crop; $('#plDate').value = isoDay(sowDay(CROP[state.crop], state.week).d); $('#plSurf').value = state.surface; if (state.parcelle) $('#plParc').value = state.parcelle;
    $('#carnet').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start'}); (state.parcelles.length ? $('#plSurf') : $('#pNom')).focus({preventScroll:true}); });
  const AK = {aRdt:'rdt',aPrix:'prix',aCout:'cout',aCycle:'cycle',aAnim:'anim',aH:'h'};
  Object.keys(AK).forEach(id=>{
    $('#'+id).addEventListener('change', e=>{ const key = AK[id]; let v = parseFloat(String(e.target.value).replace(',','.'));
      const o = state.overrides[state.crop] = state.overrides[state.crop] || {};
      if (key==='anim'){ if (v>=0 && v<=90) o.anim = v/100; else delete o.anim; } else { if (v>0) o[key] = v; else delete o[key]; }
      if (!Object.keys(o).length) delete state.overrides[state.crop];
      update(); });
  });
  $('#aReset').addEventListener('click', ()=>{ delete state.overrides[state.crop]; update(); });
}
function syncControls(){
  $('#lieu').value = state.lieu.mode==='node' ? state.lieu.id : '__pos';
  const dd = MARCHES.filter(m=>!m.local).map(m=>({m, d:LOC.dist[m.id]})).sort((a,b)=>a.d-b.d);
  $('#lieuInfo').textContent = LOC.mode==='fret' ? `${LOC.label} · pas de route vers la côte : fret compté ${nf2.format(FRET_KG)} €/kg · climat ${zone().nom}`
    : `${LOC.label} · ${dd.slice(0,3).map(x=>x.m.nom+' '+nf0.format(x.d)+' km').join(', ')} · climat ${zone().nom}`;
  $('#basse').value = state.basse; $('#basseV').textContent = state.basse + ' %';
  $('#solInfo').textContent = `Près de ${LOC.near.nom} : ${SOLS[SOILFX.haut].nom} en terre haute, ${SOLS[SOILFX.bas].nom} en terre basse (géologie BRGM).`;
  $('#parcSel').innerHTML = '<option value="">Nouvelle parcelle (sans historique)</option>' + state.parcelles.map(q=>`<option value="${q.id}">${esc(q.nom)} · ${nf0.format(q.surface)} m²</option>`).join('');
  $('#parcSel').value = state.parcelles.some(q=>q.id===state.parcelle) ? state.parcelle : '';
  const F = FUEL[state.fuel]; $('#fuelInfo').textContent = `${state.fuel==='gazole'?'Gazole':'Sans plomb'} : ${nf2.format(F.last.v)} €/L en ${moisCle(F.last.k)} (prix préfectoral)`;
  for (const [id,key] of [['#conduite','conduite'],['#metric','metric'],['#scenario','scenario'],['#pression','pression'],['#fuel','fuel'],['#mo','mo']])
    document.querySelectorAll(id+' button').forEach(b=>b.setAttribute('aria-pressed', b.dataset.v===state[key]));
  document.querySelectorAll('#cats button').forEach(b=>b.setAttribute('aria-pressed', !!state.cats[b.dataset.v]));
  for (const id of ['surface','vendu','conso','trips','place','usure','taux']) if (document.activeElement !== $('#'+id)) $('#'+id).value = state[id];
  $('#semaineTxt').textContent = 'Semaine du ' + fdy(START);
  $('#scenInfo').textContent = state.scenario==='prudent'
    ? 'Les montants affichés sont ceux d’une année difficile : 4 années sur 5 font mieux.'
    : 'Les montants affichés sont ceux d’une année normale (moyenne).';
  $('#profil').textContent = `${LOC.label} · ${CONDUITE_TXT[state.conduite]} · ${nf0.format(state.surface)} m² · ${state.fuel==='gazole'?'diesel':'essence'}, ${nf1.format(state.conso)} L/100 km`;
  $('#metricInfo').textContent = state.metric==='mois'
    ? 'Ce que rapporte chaque mois où la parcelle est occupée. Juste pour comparer une laitue (2 mois) et une igname (10 mois).'
    : 'Ce que rapporte une récolte entière, quelle que soit sa durée. Utile si la place ne manque pas.';
}

/* ---------- Cette semaine ---------- */
function mainReason(s){
  const f = [[s.L.pluie,'trop de pluie pendant la culture ou à la récolte'],[s.L.hum,'humidité élevée, risque de maladies'],[s.L.sec,'manque d’eau sans irrigation'],[s.L.chaleur,'chaleur trop forte']].sort((a,b)=>b[0]-a[0])[0];
  if (f[0] > .12) return `${f[1]} (rendement −${pct(f[0])})`;
  if (s.si < .95) return `prix bas à la récolte (${pct(s.si-1)} par rapport à la moyenne)`;
  return 'récolte à une période moins favorable';
}
function nextFav(c, from){ for (let i=0;i<30;i++){ const d = new Date(from); d.setDate(d.getDate()+i); if (moonFav(c,d)) return d; } return null; }
function sowLine(s){
  const sd = sowDay(s.c, s.p);
  if (!sd.fav){ const n = nextFav(s.c, weekDate(s.p)); return `Lune défavorable cette semaine${n?' : prochain jour favorable le '+fd(n):''}`; }
  return `Planter le ${JOURS[sd.d.getDay()]} ${fd(sd.d)} (lune ${s.c.lune==='bas'?'décroissante':'croissante'})`;
}
function riskLine(s){
  const v = state.metric==='mois' ? s.parMoisP20 : s.margeP20;
  return `<span class="risk${v<0?' bad':''}">Année difficile : <b class="${v<0?'perte':'gain'}">${eur(total(v))}</b>${state.metric==='mois'?'/mois':''}, à cause de : ${esc(s.cause)}</span>`;
}
function reasonShort(s){
  const f = [[s.L.pluie,'Trop de pluie'],[s.L.hum,'Trop humide, maladies'],[s.L.sec,'Trop sec sans arrosage'],[s.L.chaleur,'Trop chaud']].sort((a,b)=>b[0]-a[0])[0];
  if (f[0] > .12) return `${f[1]} : −${pct(f[0])} de récolte`;
  if (s.si < .95) return `Prix bas à la récolte (${pct(s.si-1)})`;
  return 'Période moins favorable';
}
const causeCourte = s => s.cause.startsWith('mauvaise') ? 'météo' : (s.cause.startsWith('prix') ? 'prix bas' : 'météo et prix');
function moonShort(s){
  const sd = sowDay(s.c, s.p);
  if (sd.fav) return `Lune : planter le ${JOURS[sd.d.getDay()].slice(0,3)}. ${fd(sd.d)}`;
  const n = nextFav(s.c, weekDate(s.p)); return n ? `Lune : attendre le ${fd(n)}` : 'Lune : pas de jour favorable proche';
}
const eurC = v => `<span class="${v<0?'perte':'gain'}">${eur(v)}</span>`;
function renderNow(){
  const vis = visible();
  const sims = vis.map(c=>GRID[c.id][0]).sort((a,b)=>b.score-a.score);
  const top = sims.filter(s=>s.val>0).slice(0,6);
  $('#nowTitle').textContent = 'À planter la semaine du ' + fd(START);
  $('#nowSub').textContent = `${LOC.label} · ${CONDUITE_TXT[state.conduite]} · ${nf0.format(state.surface)} m²${state.scenario==='prudent'?' · mode prudent':''}. Touchez un légume pour le détail.`;
  const parMois = state.metric==='mois';
  $('#recoList').innerHTML = top.length ? top.map((s,i)=>{ const v = parMois ? s.parMois : s.marge, p20 = parMois ? s.parMoisP20 : s.margeP20, cls = s.rentables>=8?'ok':s.rentables>=6?'mid':'no';
    return `<button type="button" class="rcard" data-crop="${s.c.id}" style="--cc:${CAT_COL[s.c.cat]}">
      <span class="rc-top"><span class="rc-rank">${i+1}</span><span class="rc-name">${esc(s.c.nom)}</span><span class="cat-tag">${esc(CATS[s.c.cat].nom)}</span></span>
      <span class="rc-money"><span class="rc-big ${v<0?'perte':'gain'}">${eur(total(v))}</span><span class="rc-unit">${parMois?'par mois':'sur la culture'}</span></span>
      <span class="rc-sub"><span>${parMois ? eurC(total(s.marge))+' sur toute la culture' : eurC(total(s.parMois))+' par mois'}</span><span class="verdict ${cls}">Rentable ${s.rentables} ans sur 10</span></span>
      <span class="rc-facts">
        <span><span class="k">Récolte</span>${fd(weekDate(s.h0))} → ${fd(weekDate(s.h1+1))}</span>
        <span><span class="k">Vendre à</span>${esc(s.best.m.nom)}, ${nf2.format(s.best.prix)} €/kg</span>
      </span>
      <span class="rc-foot">
        <span>${moonSVG(moonAge(sowDay(s.c,0).d),13)} ${esc(moonShort(s))}</span>
        <span><span>Année difficile : ${eurC(total(p20))}${parMois?'/mois':''} (${esc(causeCourte(s))})</span></span>
        ${(()=>{ const bw = bestWeek(s.c.id), bv = GRID[s.c.id][bw].val; return bw > 0 && bv > s.val*1.4 ? `<span class="rc-mieux">Encore mieux vers le ${fd(weekDate(bw))}</span>` : ''; })()}
      </span>
    </button>`; }).join('') : '<p class="muted">Aucune culture rentable cette semaine avec ces réglages. Essayez une autre façon de cultiver ou regardez le calendrier.</p>';
  const shown = new Set(top.map(s=>s.c.id));
  const cand = vis.filter(c=>!shown.has(c.id)).map(c=>{ const now = GRID[c.id][0], bw = bestWeek(c.id), best = GRID[c.id][bw]; return {now, bw, best, rel: best.val>0 ? (best.val-now.val)/best.val : 0}; })
    .filter(x=>x.best.val>0 && x.rel>.4).sort((a,b)=>b.rel-a.rel).slice(0,4);
  $('#avoidList').innerHTML = cand.length ? cand.map(x=>`<li><button type="button" class="acard" data-crop="${x.now.c.id}" style="--cc:${CAT_COL[x.now.c.cat]}">
      <span class="rc-top"><span class="a-name">${esc(x.now.c.nom)}</span><span class="cat-tag">${esc(CATS[x.now.c.cat].nom)}</span></span>
      <span class="a-why">${esc(reasonShort(x.now))}</span>
      <span class="a-best">Meilleure période : vers le <b>${fd(weekDate(x.bw))}</b></span>
      <span class="a-cmp">${eurC(total(x.best.val))} au lieu de ${eurC(total(x.now.val))}${parMois?' par mois':''}</span>
    </button></li>`).join('')
    : '<li class="small muted">Rien à éviter particulièrement cette semaine.</li>';
}

/* ---------- Calendrier ---------- */
const seuilZero = maxAbs => Math.max(10, maxAbs*.003); // en dessous : « ≈ 0 »
function colorFor(v, maxAbs){
  if (!isFinite(v) || maxAbs<=0) return 'var(--cell-0)';
  if (Math.abs(v) < seuilZero(maxAbs)) return 'var(--cell-0)';
  const t = v/maxAbs, a = Math.sqrt(Math.abs(t)); // échelle racine : les petits gains restent visibles à côté des très gros
  const step = a < .2 ? 1 : a < .4 ? 2 : a < .6 ? 3 : a < .8 ? 4 : 5;
  return `var(--${t>0?'p':'n'}${step})`;
}
function renderHeat(){
  const vis = visible(); let mx = 0, mn = 0;
  vis.forEach(c=>GRID[c.id].forEach(s=>{ const v = total(s.val); mx = Math.max(mx, Math.abs(v)); mn = Math.min(mn, v); }));
  let h = '<div></div>';
  for (let w=0; w<52; w++){ const d = weekDate(w), pv = weekDate(w-1); h += `<div class="mlabel">${((w===0 && d.getDate()<=21) || (w>0 && d.getMonth()!==pv.getMonth())) ? MOIS[d.getMonth()] : ''}</div>`; }
  for (const [k,v] of Object.entries(CATS)){
    const cs = vis.filter(c=>c.cat===k); if (!cs.length) continue;
    h += `<div class="grp"><span class="cat-dot" style="background:${CAT_COL[k]}"></span>${esc(v.nom)}</div>`;
    for (const c of cs){
      const bw = bestWeek(c.id);
      h += `<button type="button" class="rlabel" data-crop="${c.id}" style="--cc:${CAT_COL[k]}">${esc(c.nom)}</button>`;
      GRID[c.id].forEach((s,w)=>{ h += `<div class="c${w===bw?' best':''}" data-crop="${c.id}" data-week="${w}" style="background:${colorFor(total(s.val),mx)}"></div>`; });
    }
  }
  $('#heat').innerHTML = h; markHeatSel();
  const lab = (state.metric==='mois' ? 'Marge par mois de terrain occupé' : 'Marge par récolte') + (state.scenario==='prudent' ? ', année difficile' : ', année normale');
  $('#heatLegend').innerHTML = `<span>${lab} (${nf0.format(state.surface)} m²) :</span>
    ${mn<0?`<span class="sw"><i style="background:var(--n5)"></i><i style="background:var(--n3)"></i><i style="background:var(--n1)"></i></span><span>perte jusqu'à <b class="perte">${eur(mn)}</b></span>`:''}
    <span class="sw"><i style="background:var(--cell-0)"></i></span><span>≈ 0 (moins de ${eur(seuilZero(Math.max(mx, -mn)))})</span>
    <span class="sw"><i style="background:var(--p1)"></i><i style="background:var(--p3)"></i><i style="background:var(--p5)"></i></span><span>gain jusqu'à <b class="gain">${eur(mx)}</b></span>
    <span><span class="bestmk"></span>meilleure semaine</span>`;
}
function markHeatSel(){
  document.querySelectorAll('#heat .c.sel').forEach(el=>el.classList.remove('sel'));
  const el = document.querySelector(`#heat .c[data-crop="${state.crop}"][data-week="${state.week}"]`); if (el) el.classList.add('sel');
  document.querySelectorAll('#heat .rlabel').forEach(b=>{ if (b.dataset.crop===state.crop) b.setAttribute('aria-current','true'); else b.removeAttribute('aria-current'); });
}

/* ---------- Détail ---------- */
function niceStep(range){ const raw = range/4; const p = Math.pow(10, Math.floor(Math.log10(raw||1))); const n = raw/p; return (n<1.5?1:n<3?2:n<7?5:10)*p; }
function renderDetail(){
  const c = CROP[state.crop], arr = GRID[c.id], s = arr[state.week], bw = bestWeek(c.id);
  $('#dCrop').value = c.id; $('#dWeek').value = state.week; $('#dWeekTxt').textContent = fdy(weekDate(state.week));
  $('#dCat').innerHTML = `<span class="cat-tag" style="--cc:${CAT_COL[c.cat]}">${esc(CATS[c.cat].nom)}</span>`;
  $('#dTitle').textContent = `${c.nom} · plantation la semaine du ${fd(weekDate(state.week))}`;
  $('#dSow').innerHTML = moonSVG(moonAge(sowDay(c,state.week).d),16) + ' ' + esc(sowLine(s));
  const bestLbl = state.week===bw ? 'meilleure semaine de l’année' : `meilleure semaine : ${fd(weekDate(bw))}`;
  const mP20 = state.metric==='mois' ? s.parMoisP20 : s.margeP20;
  const marg = s.best.prix > 0 ? 1 - s.prixRevient/s.best.prix : 0;
  $('#kpis').innerHTML = `
    <div><span class="k">Récolte</span><span class="v">${fd(weekDate(s.h0))}</span><span class="s">pendant ${c.recS} sem. · environ ${s.dureeJ} j après plantation · ${nf1.format(s.rdt)} kg/m² (${pct(s.rdt/s.rdtPot)} du potentiel), soit ${nf0.format(total(s.rdt))} kg</span></div>
    <div><span class="k">Prix de revient</span><span class="v">${nf2.format(s.prixRevient)} €/kg</span><span class="s">prix minimum pour couvrir intrants, main-d’œuvre et transport · marge de sécurité ${marg>=0?pct(marg):'négative'}</span></div>
    <div><span class="k">Vendre à</span><span class="v">${nf2.format(s.best.prix)} €/kg</span><span class="s">${esc(s.best.m.nom)}${s.best.km?` · ${nf0.format(s.best.km)} km · transport ${nf2.format(s.best.tr)} €/kg`:''}</span></div>
    <div><span class="k">Vous gagnez en moyenne</span><span class="v ${s.marge<0?'perte':'gain'}">${eur(total(s.marge))}</span><span class="s">${eurC(total(s.parMois))}/mois · <span class="verdict ${s.rentables>=8?'ok':s.rentables>=6?'mid':'no'}">rentable ${s.rentables} ans sur 10</span><br>année difficile : ${eurC(total(mP20))}${state.metric==='mois'?'/mois':''} (4 années sur 5 font mieux), à cause de : ${esc(s.cause)}${s.heures>0?`<br>une heure de votre travail rapporte ${nf2.format(s.remH)} €`:''} · ${bestLbl}</span></div>`;
  // Barres
  const pick = state.metric==='mois' ? (x=>[x.parMois,x.parMoisP20]) : (x=>[x.marge,x.margeP20]);
  const vals = arr.map(x=>pick(x).map(total));
  $('#chartUnit').textContent = (state.metric==='mois'?'€ par mois d’occupation':'€ par culture') + ` · ${nf0.format(state.surface)} m²`;
  let mx = Math.max(0, ...vals.flat()), mn = Math.min(0, ...vals.flat()); if (mx===mn) mx = mn+1;
  const st = niceStep(mx-mn); mx = Math.ceil(mx/st)*st; mn = Math.floor(mn/st)*st;
  const H = 170, y = v => H*(mx-v)/(mx-mn), cw = 100/52;
  let b = '';
  for (let v=mn; v<=mx+1e-9; v+=st) b += `<div class="grid${Math.abs(v)<1e-9?' zero':''}" style="top:${y(v)}px"></div><div class="ylab" style="top:${y(v)}px">${nf0.format(v)}</div>`;
  vals.forEach(([v,p20],i)=>{ const top = y(Math.max(v,0)), hh = Math.max(1, Math.abs(y(v)-y(0)));
    b += `<div class="col${i===state.week?' sel':''}${i===bw?' best':''}" data-week="${i}" style="left:${i*cw}%;width:${cw}%"><div class="bar${v<0?' neg':''}" style="top:${top}px;height:${hh}px"></div><div class="p20" style="top:${(y(p20)-1).toFixed(1)}px"></div></div>`; });
  $('#bars').innerHTML = b;
  let xa = ''; for (let w=0; w<52; w++){ const d = weekDate(w), pv = weekDate(w-1); if ((w===0 && d.getDate()<=21) || (w>0 && d.getMonth()!==pv.getMonth())) xa += `<span style="left:${w*cw}%">${MOIS[d.getMonth()]}</span>`; }
  $('#xaxis').innerHTML = xa;
  const rs = []; for (let w=0; w<52; w++){ let r=0; for (let k=0;k<NY;k++) r += clim(w,k).pluieSem; rs.push(r/NY); }
  const rmax = Math.max(...rs);
  $('#rain').innerHTML = `<span class="rl">${nf0.format(rmax)} mm</span>` + rs.map((r,w)=>`<div class="rb" data-rain="${w}" style="left:calc(${w*cw}% + 1px);width:calc(${cw}% - 2px);height:${(r/rmax*42).toFixed(1)}px"></div>`).join('');
  // Marchés
  const maxNet = Math.max(...s.mk.map(m=>m.net), .01);
  $('#mktSub').textContent = `récolte du ${fd(weekDate(s.h0))} au ${fd(weekDate(s.h1+1))}`;
  const dn = DERNIER[c.id];
  $('#mktDaaf').textContent = dn ? `Mercuriale DAAF du ${fd(dn.d)} : ${nf2.format(dn.prix)} €/kg en moyenne en Guyane${dn.min && dn.max ? ` (de ${nf2.format(dn.min)} à ${nf2.format(dn.max)} €${dn.obs ? `, le plus souvent ${nf2.format(dn.obs)} €` : ''})` : ''}. Le prix de chaque marché suit l’écart relevé par la DAAF entre les marchés.` : 'Pas encore de mercuriale DAAF pour ce légume : prix estimés.';
  $('#mkt').innerHTML = `<thead><tr><th>Marché</th><th class="r">Distance</th><th class="r">Prix attendu</th><th class="r">Transport</th><th class="r">Net €/kg</th><th style="width:20%"></th><th class="r">Relevé DAAF</th></tr></thead><tbody>` +
    s.mk.slice().sort((a,b)=>b.net-a.net).map(m=>{ const cal = CAL[c.id] && CAL[c.id][m.m.id];
      return `<tr class="${m===s.best?'best':''}"><td>${esc(m.m.nom)}${m===s.best?'<span class="badge">meilleur</span>':''}</td>
      <td class="r num">${m.m.local ? '—' : (m.km==null ? 'fret' : nf0.format(m.km)+' km')}</td>
      <td class="r num">${nf2.format(m.prix)}</td><td class="r num${m.tr>0?' perte':''}">${m.tr>0?'−'+nf2.format(m.tr):'0'}</td><td class="r num ${m.net<0?'perte':'gain'}">${nf2.format(m.net)}</td>
      <td><div class="netbar" style="width:${Math.max(0,m.net)/maxNet*100}%"></div></td>
      <td class="r small" style="white-space:nowrap">${cal ? nf2.format(cal.last.prix)+' €<br><span class="muted">'+fd(cal.last.date)+'</span>' : '<span class="muted">—</span>'}</td></tr>`; }).join('') + '</tbody>';
  const anyReal = s.mk.some(m=>m.src!=='estim'), F = FUEL[state.fuel];
  $('#mktNote').textContent = (LOC.mode==='fret'
      ? `Pas de route vers la côte : fret compté ${nf2.format(FRET_KG)} €/kg, plus ${nf0.format(state.place)} € de frais de place par marché. `
      : `Transport : ${s.trips} allers-retours pendant la récolte, ${nf1.format(state.conso)} L/100 km, ${state.fuel==='gazole'?'gazole':'sans plomb'} prévu à ${nf2.format(s.fuelP)} €/L à la récolte (${nf2.format(F.last.v)} €/L en ${moisCle(F.last.k)}), usure ${nf2.format(state.usure)} €/km, ${nf0.format(state.place)} € de place par marché. `) +
    (anyReal ? 'Prix des marchés tirés des mercuriales DAAF.' : 'Sans mercuriales, les marchés côtiers ont le même prix estimé : le transport les départage.');
  // Facteurs
  const f = [];
  f.push(`<li><span>Rendement de référence${s.abri?' (abri +30 %)':''}</span><span class="mono">${nf1.format(s.rdtPot)} kg/m²</span></li>`);
  const lossLine = (lbl, v) => { if (v > .005) f.push(`<li><span>${lbl}</span><span class="neg">−${pct(v)}</span></li>`); };
  lossLine('Excès de pluie (pourriture, maladies, fruits abîmés)', s.L.pluie);
  lossLine('Humidité de l’air (champignons)', s.L.hum);
  lossLine('Manque d’eau sans irrigation', s.L.sec);
  lossLine('Chaleur ou température hors plage idéale', s.L.chaleur);
  lossLine(`Animaux et ravageurs (${esc(c.nuis)})`, s.L.anim);
  f.push(`<li><span>Sol : ${esc(SOLS[SOILFX.haut].court)} ${100-state.basse} %, ${esc(SOLS[SOILFX.bas].court)} ${state.basse} % · sensibilité à l’excès de pluie ×${nf1.format(SOILFX.pluie)}, à la sécheresse ×${nf1.format(SOILFX.sec)}</span><span class="${SOILFX.rdt>=1?'pos':'neg'}">${SOILFX.rdt>=1?'+':'−'}${pct(Math.abs(SOILFX.rdt-1))}</span></li>`);
  if (s.rot.note) f.push(`<li><span>Rotation : ${esc(s.rot.note)}</span><span class="${s.rot.f>=1?'pos':'neg'}">${s.rot.f>=1?'+':'−'}${pct(Math.abs(s.rot.f-1))}</span></li>`);
  else if (state.parcelle) f.push(`<li><span>Rotation : aucune culture de la même famille (${esc(FAM[c.fam]||c.fam)}) récemment sur cette parcelle</span><span class="pos">OK</span></li>`);
  if (s.perso && s.perso.n) f.push(`<li><span>${s.perso.n>1?'Vos '+s.perso.n+' récoltes notées':'Votre récolte notée'} : rendement ajusté à votre ferme</span><span class="${s.perso.f>=1?'pos':'neg'}">${s.perso.f>=1?'+':'−'}${pct(Math.abs(s.perso.f-1))}</span></li>`);
  if (s.ensoA > .1) f.push(`<li><span>Saison annoncée (${esc(ENSO.prevision.libelle)}) : le calcul s’appuie surtout sur ${esc(s.ensoTop)}</span><span class="muted">poids ${pct(s.ensoA)}</span></li>`);
  if (s.noAbri) f.push(`<li><span>Culture peu adaptée à l’abri : calcul en plein champ irrigué</span><span class="muted">—</span></li>`);
  const lag = s.dureeJ - Math.ceil(eff(c,'cycle')/7)*7; if (lag >= 4) f.push(`<li><span>Croissance ralentie (ciel couvert, températures)</span><span class="neg">+${lag} j</span></li>`);
  const sp = s.si - 1; f.push(`<li><span>Prix de saison à la récolte (par rapport à la moyenne de l’année)</span><span class="${sp>=0?'pos':'neg'}">${sp>=0?'+':'−'}${pct(Math.abs(sp))}</span></li>`);
  if (c.paques){ let fe = 1; for (let q=s.h0;q<=s.h1;q++) fe = Math.max(fe, fete(midWeek(q))); if (fe>1) f.push(`<li><span>Récolte avant ${fe>1.2?'Pâques':'la Pentecôte'} : demande du bouillon d’awara</span><span class="pos">+${pct(fe-1)}</span></li>`); }
  f.push(`<li><span>Recette (${nf1.format(s.rdt)} kg/m² × ${nf0.format(state.vendu)} % vendus × ${nf2.format(s.best.prix)} €/kg, prix corrigé selon la récolte de l’année)</span><span class="pos">${eur(total(s.recette))}</span></li>`);
  if (s.tr > 0) f.push(`<li><span>Transport vers ${esc(s.best.m.nom)} (${s.best.km!=null?nf0.format(s.best.km)+' km, ':''}${s.trips} allers-retours)</span><span class="neg">−${eur(total(s.tr))}</span></li>`);
  f.push(`<li><span>Intrants${s.plF>1.005?` (semences et plants ${sgn((s.plF-1)*100)} % d’ici la plantation)`:''}${s.coutEau>.005?', pompage de l’eau '+nf2.format(s.coutEau)+' €/m²':''}${s.coutAbri>0?', abri '+nf2.format(s.coutAbri)+' €/m²':''}</span><span class="neg">−${eur(total(s.cout))}</span></li>`);
  if (s.heures > 0) f.push(`<li><span>Main-d’œuvre : ${nf0.format(s.heures)} h (culture ${nf0.format(eff(c,'h')*state.surface/100)} h, vente ${nf0.format(s.best.hV)} h)${s.taux ? ' à '+nf2.format(s.taux)+' €/h' : ', non comptée'}</span><span class="neg">${s.mo>0 ? '−'+eur(total(s.mo)) : '0 €'}</span></li>`);
  f.push(`<li><span><b>Marge moyenne</b> · de ${eur(total(s.minMarge))} à ${eur(total(s.maxMarge))} selon la météo et le marché</span><span class="${s.marge>=0?'pos':'neg'}"><b>${eur(total(s.marge))}</b></span></li>`);
  $('#factors').innerHTML = f.join('');
  // Lune
  let mr = ''; const d0 = weekDate(state.week); d0.setDate(d0.getDate()-3);
  for (let i=0;i<14;i++){ const d = new Date(d0); d.setDate(d.getDate()+i); const a = moonAge(d), fav = moonFav(c,d);
    mr += `<div class="mday${fav?' fav':''}" title="${phaseNom(a)}"><span>${['dim.','lun.','mar.','mer.','jeu.','ven.','sam.'][d.getDay()]}</span><span class="d">${d.getDate()}/${d.getMonth()+1}</span>${moonSVG(a,20)}<span>${fav?'favorable':'&nbsp;'}</span></div>`; }
  $('#moonrow').innerHTML = mr;
  $('#moonSub').textContent = (c.lune==='bas' ? 'racines : lune décroissante' : 'feuilles et fruits : lune croissante') + ' · phases calculées pour ' + weekDate(state.week).getFullYear();
  // Ajustements
  const o = state.overrides[c.id] || {};
  $('#aRdt').value = o.rdt ?? ''; $('#aRdt').placeholder = nf1.format(c.rdt);
  $('#aPrix').value = o.prix ?? ''; $('#aPrix').placeholder = nf1.format(baseReel(c));
  $('#aCout').value = o.cout ?? ''; $('#aCout').placeholder = nf1.format(c.cout);
  $('#aH').value = o.h ?? ''; $('#aH').placeholder = c.h;
  $('#aCycle').value = o.cycle ?? ''; $('#aCycle').placeholder = c.cycle;
  $('#aAnim').value = o.anim != null ? Math.round(o.anim*100) : ''; $('#aAnim').placeholder = Math.round(c.anim*100);
}

/* ---------- Climat ---------- */
function renderClimate(){
  const z = zone(), s = series(z.id);
  const stn = z.st.map(id=>STN[id]).join(' et ');
  const annR = s.mp.reduce((a,b)=>a+b,0), annN = s.np.reduce((a,b)=>a+b,0);
  const tR = s.mt.reduce((a,b)=>a+b,0)/12, tN = s.nt ? s.nt.reduce((a,b)=>a+b,0)/12 : null;
  const wet = [3,4].reduce((a,m)=>a+s.mp[m],0), wetN = [3,4].reduce((a,m)=>a+s.np[m],0);
  $('#cTitle').textContent = 'Climat récent : ' + z.nom;
  $('#cSrc').textContent = `Relevés de ${s.label}, station${z.st.length>1?'s':''} ${stn}${z.st.length>1?' (moyenne)':''}, comparés à la normale 1991-2020.`;
  $('#climSum').innerHTML = `
    <div><span class="k">Pluie par an, 11 dernières saisons</span><span class="v">${nf0.format(annR)} mm</span><span class="s">${sgn((annR/annN-1)*100)} % par rapport à 1991-2020 · de ${nf0.format(Math.min(...s.ann))} à ${nf0.format(Math.max(...s.ann))} mm selon l’année</span></div>
    <div><span class="k">Avril + mai</span><span class="v">${nf0.format(wet)} mm</span><span class="s">${sgn((wet/wetN-1)*100)} % : le cœur de la saison des pluies ${wet>wetN*1.05?'est plus arrosé qu’avant':'reste proche de la normale'}</span></div>
    <div><span class="k">Température moyenne</span><span class="v">${nf1.format(tR)} °C</span><span class="s">${tN!=null ? (tR>=tN?'+':'−')+nf1.format(Math.abs(tR-tN))+' °C par rapport à 1991-2020' : 'pas de normale publiée pour comparer'}${s.hot?' · année la plus chaude : '+s.hot.y:''}</span></div>`;
  const mx = Math.max(...s.maxp);
  $('#climTable').innerHTML = `<thead><tr><th>Mois</th><th class="r">Pluie (11 saisons)</th><th style="width:34%">mm</th><th class="r">Écart 1991-2020</th><th class="r">Année sèche → humide</th><th class="r">T° moy.</th><th class="r">T° max</th><th class="r">Humidité (est.)</th><th class="r">Attendu ${esc(ENSO.prevision ? ENSO.prevision.libelle : '')}</th></tr></thead><tbody>` +
    s.mp.map((p,i)=>{ const dv = (p/s.np[i]-1)*100, ex = expectedMonth(((i - START.getMonth()) % 12 + 12) % 12);
      return `<tr class="${p<120?'dry':''}"><td>${MOIS[i]}</td><td class="r num">${nf0.format(p)}</td>
      <td><div class="cbwrap"><div class="rng" style="left:${(s.minp[i]/mx*100).toFixed(1)}%;width:${((s.maxp[i]-s.minp[i])/mx*100).toFixed(1)}%"></div><div class="cb" style="width:${(p/mx*100).toFixed(1)}%;background:var(--rain)"></div><div class="cn" style="left:calc(${(s.np[i]/mx*100).toFixed(1)}% - 1px)"></div></div></td>
      <td class="r num ${dv>10?'delta-up':(dv<-10?'delta-hot':'')}">${sgn(dv)} %</td><td class="r num">${nf0.format(s.minp[i])} → ${nf0.format(s.maxp[i])}</td>
      <td class="r num">${nf1.format(s.mt[i])}</td><td class="r num">${nf1.format(s.mx[i])}</td><td class="r num">${nf0.format(72+.6*joursPluie(p))} %</td><td class="r num">${ex.alpha>.15 ? `${nf0.format(ex.v)} <span class="small ${ex.v<p*.9?'delta-hot':(ex.v>p*1.1?'delta-up':'muted')}">(${sgn((ex.v/p-1)*100)} %)</span>` : '<span class="muted">—</span>'}</td></tr>`; }).join('') + '</tbody>';
}

/* ---------- Hypothèses ---------- */
function renderHyp(){
  const mx = k => Math.max(...CULTURES.map(c=>eff(c,k)));
  const M = {cycle:mx('cycle'), rdt:mx('rdt'), prix:Math.max(...CULTURES.map(baseEstim)), h:mx('h')};
  const bar = (k, v) => `<span class="hbar" aria-hidden="true"><i style="width:${Math.max(5, v/M[k]*100).toFixed(0)}%"></i></span>`;
  const pluie = c => c.pluieMax >= 400 ? ['ok','Supporte bien'] : c.pluieMax >= 250 ? ['mid','Moyen'] : ['no','Craint la pluie'];
  const anim = v => v <= .08 ? 'faible' : v <= .12 ? 'mid' : 'no';
  let rows = '';
  for (const [k,v] of Object.entries(CATS)){
    rows += `<tr class="grp-row"><th colspan="10" scope="colgroup"><span class="grp-lbl"><span class="cat-dot" style="background:${CAT_COL[k]}"></span>${esc(v.nom)}</span></th></tr>`;
    rows += CULTURES.filter(c=>c.cat===k).map(c=>{ const mine = !!state.overrides[c.id], [pc, pl] = pluie(c), an = eff(c,'anim');
      return `<tr class="${mine?'mine':''}"><th scope="row"><span class="cat-bar" style="background:${CAT_COL[k]}"></span>${esc(c.nom)}${mine?' <span class="badge">vos valeurs</span>':''}<small>${esc(FAM[c.fam]||'')}</small></th>
        <td class="r num">${eff(c,'cycle')} j${bar('cycle', eff(c,'cycle'))}</td>
        <td class="r num">${c.recS} sem.</td>
        <td class="r num">${nf1.format(eff(c,'rdt'))} kg/m²${bar('rdt', eff(c,'rdt'))}</td>
        <td class="r num">${nf2.format(baseEstim(c))} €/kg${bar('prix', baseEstim(c))}${DERNIER[c.id] ? `<span class="hbar-t small muted">relevé DAAF ${nf2.format(DERNIER[c.id].prix)} € le ${fd(DERNIER[c.id].d)}</span>` : '<span class="hbar-t small muted">estimation</span>'}</td>
        <td class="r num">${nf1.format(eff(c,'cout'))} €/m²<span class="hbar-t small muted">dont plants ${nf1.format(eff(c,'pl'))} €</span></td>
        <td class="r num">${nf0.format(eff(c,'h'))} h${bar('h', eff(c,'h'))}</td>
        <td class="r"><span class="verdict ${anim(an)}">${nf0.format(an*100)} %</span></td>
        <td><span class="verdict ${pc}">${pl}</span></td>
        <td class="wrap">${esc(c.nuis)}</td></tr>`; }).join('');
  }
  $('#hypTable').innerHTML = `<thead><tr><th scope="col">Légume</th><th class="r">Plantation → récolte</th><th class="r">Récolte pendant</th><th class="r">Rendement</th><th class="r">Prix moyen sur l’année à Cayenne</th><th class="r">Intrants</th><th class="r">Travail pour 100 m²</th><th class="r">Pertes animaux</th><th>Pluie</th><th>Principaux nuisibles</th></tr></thead><tbody>${rows}</tbody>`;
  const pi = plantsIdx(new Date());
  $('#hypNote').textContent = `Semences et plants : indice IPAMPA ${nf1.format(PLANTS_IDX[2024])} en 2024 (base 100 en 2020), tendance ${sgn(pi.pct*100)} % par an, appliquée à la date de plantation. Engrais non indexés. Heure de travail : ${nf2.format(state.taux)} € (SMIC brut) si vous comptez votre temps.`;
}

/* ---------- Saison annoncée ---------- */
function renderEnso(){
  const pv = ENSO && ENSO.prevision, box = $('#enso'); if (!pv){ box.hidden = true; return; } box.hidden = false;
  let e = 0, m = 0; const s = series(state.zone); for (let i=0;i<6;i++){ const x = expectedMonth(i); e += x.v; m += s.mp[x.d.getMonth()]; }
  const d0 = new Date(START.getFullYear(), START.getMonth(), 15), d5 = new Date(START.getFullYear(), START.getMonth()+5, 15);
  const sec = pv.etat==='nino', hum = pv.etat==='nina';
  box.innerHTML = `<b>Saison à venir : ${esc(pv.libelle)}</b> <span class="small muted">(prévision NOAA, ${esc(moisCle(pv.emission))})</span><br>${sec ? 'Attendez-vous à une saison sèche longue et chaude.' : hum ? 'Attendez-vous à une saison plus pluvieuse que d’habitude.' : 'Pas d’épisode marqué annoncé.'} De ${MOIS[d0.getMonth()]} à ${MOIS[d5.getMonth()]}, l’appli prévoit ${nf0.format(e)} mm de pluie dans votre zone, contre ${nf0.format(m)} mm d’habitude (${sgn((e/m-1)*100)} %). Tous les conseils en tiennent compte.`;
}

/* ---------- Carnet ---------- */
function renderCarnet(){
  const P = state.parcelles, L = state.plantations;
  $('#plParc').innerHTML = P.length ? P.map(q=>`<option value="${q.id}">${esc(q.nom)}</option>`).join('') : '<option value="">Ajoutez d’abord une parcelle</option>';
  if (state.parcelle && P.some(q=>q.id===state.parcelle)) $('#plParc').value = state.parcelle;
  $('#parcList').innerHTML = P.length ? P.map(q=>{ const last = L.filter(x=>x.parcelle===q.id).sort((a,b)=>b.date.localeCompare(a.date))[0];
    return `<li><div><b>${esc(q.nom)}</b> · ${nf0.format(q.surface)} m² · terre basse ${q.basse} %${q.id===state.parcelle?' <span class="badge">utilisée</span>':''}</div>
      <div class="small muted">Sols : ${esc(SOLS[SOILFX.haut].court)} en haut, ${esc(SOLS[SOILFX.bas].court)} en bas${last ? ` · dernière culture : ${esc(CROP[last.culture].nom)} (${fd(new Date(last.date+'T12:00:00'))})` : ''}</div>
      <div class="row-btns">${q.id===state.parcelle ? '' : `<button type="button" class="linkbtn" data-act="usep" data-id="${q.id}">Utiliser pour les calculs</button>`}<button type="button" class="linkbtn danger" data-act="delp" data-id="${q.id}">Supprimer</button></div></li>`; }).join('')
    : '<li class="small muted">Aucune parcelle pour l’instant. Ajoutez-en une : l’appli tiendra compte de ses sols et de ce qui y a poussé.</li>';
  const today = new Date();
  $('#plList').innerHTML = L.length ? L.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(x=>{ const c = CROP[x.culture], q = P.find(r=>r.id===x.parcelle), d = new Date(x.date+'T12:00:00');
      const pr = x.predRdt ? x.predRdt*(PERSO_F[x.culture] ? PERSO_F[x.culture].f : 1)*x.surface : null, rd = x.recolteDate ? new Date(x.recolteDate+'T12:00:00') : null;
      const vs = x.ventes || [], vKg = vs.reduce((a,v)=>a+v.kg,0), vEur = vs.reduce((a,v)=>a+v.kg*v.prix,0);
      const statut = x.recolteKg ? `récolté ${nf0.format(x.recolteKg)} kg${pr?` (${sgn((x.recolteKg/(x.predRdt*x.surface)-1)*100)} % par rapport à la prévision)`:''}` : (rd ? (rd <= today ? `<b>récolte en cours ou à venir</b> depuis le ${fd(rd)}` : `récolte prévue vers le ${fd(rd)}`) : '');
      return `<li style="border-left:4px solid ${c ? CAT_COL[c.cat] : 'var(--line)'}"><div><b>${esc(c ? c.nom : x.culture)}</b> · ${esc(q ? q.nom : 'parcelle supprimée')} · planté le ${fdy(d)} · ${nf0.format(x.surface)} m²</div>
        <div class="small muted">${statut}${pr && !x.recolteKg ? ` · environ ${nf0.format(pr)} kg attendus` : ''}${vKg ? ` · vendu ${nf0.format(vKg)} kg pour <span class="gain">${eur(vEur)}</span>` : ''}</div>
        <details class="act"><summary>Noter la récolte</summary><div class="locrow"><input type="number" min="0" step="1" placeholder="kg récoltés au total" data-in="kg" aria-label="Kilos récoltés au total"><button type="button" class="btn ghost" data-act="rec" data-id="${x.id}">Enregistrer</button></div></details>
        <details class="act"><summary>Noter une vente</summary><div class="locrow"><input type="number" min="0" step="0.1" placeholder="kg" data-in="vkg" aria-label="Kilos vendus"><input type="number" min="0" step="0.01" placeholder="€ le kg" data-in="vprix" aria-label="Prix au kilo"><select data-in="vmar" aria-label="Marché">${MARCHES.map(m=>`<option value="${m.id}">${esc(m.nom)}</option>`).join('')}</select><button type="button" class="btn ghost" data-act="vente" data-id="${x.id}">Enregistrer</button></div></details>
        <button type="button" class="linkbtn danger" data-act="delpl" data-id="${x.id}">Supprimer</button></li>`; }).join('')
    : '<li class="small muted">Aucune plantation notée. Quand vous plantez, notez-le ici : l’appli vous rappellera la récolte et apprendra de vos résultats.</li>';
  const res = CULTURES.map(c=>({c, p:PERSO_F[c.id]})).filter(x=>x.p && x.p.n);
  $('#carnetRes').innerHTML = res.length ? res.map(x=>`<li>${esc(x.c.nom)} : vos récoltes font ${sgn((x.p.brut-1)*100)} % par rapport au modèle (${x.p.n} culture${x.p.n>1?'s':''}). L’appli applique ${sgn((x.p.f-1)*100)} % pour votre ferme, et s’en rapprochera à chaque nouvelle récolte notée.</li>`).join('')
    : '<li class="muted">Rien pour l’instant. Dès que vous notez une récolte, l’appli compare avec sa prévision et s’ajuste à votre ferme.</li>';
}

/* ---------- Données ---------- */
function renderStatus(){
  const n = (OFFICIEL.releves||[]).length, pill = $('#pillPrix'), sc = series(state.zone);
  const ds = n ? OFFICIEL.releves.map(r=>r.date).sort() : [];
  if (n){ pill.classList.add('ok'); $('#pillPrixTxt').textContent = `Prix : mercuriales DAAF jusqu'au ${fd(new Date(ds[ds.length-1]+'T12:00:00'))}`; }
  else { pill.classList.remove('ok'); $('#pillPrixTxt').textContent = 'Prix : estimations (mercuriales à venir)'; }
  $('#pillClim').textContent = 'Climat : relevés jusqu’à ' + moisAbs(sc.E);
  $('#dataStatus').textContent = `Climat : relevés réels de ${sc.label}. Prix : ${n ? n+' relevés de mercuriales DAAF archivés' : 'aucune mercuriale DAAF archivée pour l’instant, ce sont des estimations de départ'}.`;
  let nm = 0; for (const id in CLIMAT.stations) nm += Object.keys(stationMonths(id)).length;
  const nc = Object.keys(CARBU.mois).length, lastC = Object.keys(CARBU.mois).sort().pop();
  $('#archive').innerHTML = `<li>Climat : ${nf0.format(nm)} mois-stations archivés, dernier mois complet : ${moisAbs(sc.E)}${CLIMAT.maj?' (mise à jour du '+fdy(new Date(CLIMAT.maj+'T12:00:00'))+')':''}.</li>` +
    `<li>Mercuriales : ${n ? `${nf0.format(n)} relevés du ${fdy(new Date(ds[0]+'T12:00:00'))} au ${fdy(new Date(ds[ds.length-1]+'T12:00:00'))}` : 'aucune pour l’instant ; la tâche planifiée les ajoutera dès que le site de la DAAF répondra'}${OFFICIEL.maj?' (mise à jour du '+fdy(new Date(OFFICIEL.maj+'T12:00:00'))+')':''}.</li>` +
    `<li>Carburant : ${nc} mois de prix préfectoraux archivés, dernier : ${moisCle(lastC)}.</li>`;
  renderFuel();
}

function renderFuel(){
  const box = (type, lbl) => { const F = FUEL[type], d6 = new Date(); d6.setMonth(d6.getMonth()+6);
    const ch = F.last.v/F.first.v - 1;
    return `<div><span class="k">${lbl}</span><span class="v">${nf2.format(F.last.v)} €/L</span><span class="s">${moisCle(F.last.k)} · ${ch>=0?'+':'−'}${pct(Math.abs(ch))} depuis ${moisCle(F.first.k)}<br>tendance ${F.slope>=0?'+':'−'}${nf0.format(Math.abs(F.slope*100))} c€/L par an · prévu dans 6 mois : ${nf2.format(fuelAt(type, d6))} €/L</span></div>`; };
  const ys = [...new Set(Object.keys(CARBU.mois).map(k=>k.slice(0,4)))].sort();
  const ym = (y, type) => { const a = Object.entries(CARBU.mois).filter(([k])=>k.startsWith(y)).map(([,v])=>+v[type]).filter(v=>v>0); return a.length ? nf2.format(a.reduce((p,q)=>p+q,0)/a.length) : '—'; };
  $('#fuelBox').innerHTML = `<div class="fuelgrid">${box('essence','Sans plomb')}${box('gazole','Gazole')}</div>
    <div class="scroll-x"><table class="small" style="margin-top:10px"><thead><tr><th>Année</th><th class="r">Sans plomb (moy.)</th><th class="r">Gazole (moy.)</th></tr></thead><tbody>${ys.map(y=>`<tr><td>${y}</td><td class="r num">${ym(y,'essence')}</td><td class="r num">${ym(y,'gazole')}</td></tr>`).join('')}</tbody></table></div>
    <p class="note">Prix maximums fixés chaque mois par la préfecture. L’appli prolonge la tendance jusqu’à la date de récolte.</p>`;
}

/* ---------- Infobulles et clics ---------- */
const tip = $('#tip');
function showTip(html, x, y){ tip.innerHTML = html; tip.hidden = false; const r = tip.getBoundingClientRect(); let L = x+14, T = y - r.height - 14; if (L + r.width > innerWidth-8) L = x - r.width - 14; if (T < 8) T = y + 18; tip.style.left = Math.max(8,L)+'px'; tip.style.top = Math.max(8,T)+'px'; }
function hideTip(){ tip.hidden = true; }
function cellTip(cid, w){ const s = GRID[cid][w]; return `<b>${esc(s.c.nom)}</b> · plantation semaine du ${fd(weekDate(w))}<br>Récolte : ${fd(weekDate(s.h0))} → ${fd(weekDate(s.h1+1))}<br>Marge moyenne : <b>${eur(total(s.marge))}</b> (${eur(total(s.parMois))}/mois)<br>Rentable ${s.rentables} ans sur 10 · année difficile : ${eur(total(s.margeP20))}<br>Prix de revient ${nf2.format(s.prixRevient)} €/kg · vendre à ${esc(s.best.m.nom)} ${nf2.format(s.best.prix)} €/kg`; }
const goDetail = () => $('#detail').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start'});
$('#heat').addEventListener('pointermove', e=>{ const el = e.target.closest('.c'); if (!el){ hideTip(); return; } showTip(cellTip(el.dataset.crop, +el.dataset.week), e.clientX, e.clientY); });
$('#heat').addEventListener('pointerleave', hideTip);
$('#heat').addEventListener('click', e=>{ const el = e.target.closest('[data-crop]'); if (!el) return; state.crop = el.dataset.crop; state.week = el.dataset.week!=null ? +el.dataset.week : bestWeek(state.crop); hideTip(); renderDetail(); markHeatSel(); save(); goDetail(); });
$('#recoList').addEventListener('click', e=>{ const el = e.target.closest('[data-crop]'); if (!el) return; state.crop = el.dataset.crop; state.week = 0; renderDetail(); markHeatSel(); save(); goDetail(); });
$('#avoidList').addEventListener('click', e=>{ const el = e.target.closest('[data-crop]'); if (!el) return; state.crop = el.dataset.crop; state.week = bestWeek(state.crop); renderDetail(); markHeatSel(); save(); goDetail(); });
$('#bars').addEventListener('pointermove', e=>{ const el = e.target.closest('.col'); if (!el){ hideTip(); return; } showTip(cellTip(state.crop, +el.dataset.week), e.clientX, e.clientY); });
$('#bars').addEventListener('pointerleave', hideTip);
$('#bars').addEventListener('click', e=>{ const el = e.target.closest('.col'); if (!el) return; state.week = +el.dataset.week; renderDetail(); markHeatSel(); });
$('#rain').addEventListener('pointermove', e=>{ const el = e.target.closest('.rb'); if (!el){ hideTip(); return; } const w = +el.dataset.rain; let p=0, t=0, lo=1e9, hi=0; for (let k=0;k<NY;k++){ const cl = clim(w,k); p += cl.pluieSem; t += cl.tmoy; lo = Math.min(lo, cl.pluieSem); hi = Math.max(hi, cl.pluieSem); }
  showTip(`Semaine du ${fd(weekDate(w))}<br>Pluie moyenne (11 saisons) : <b>${nf0.format(p/NY)} mm</b><br>selon l’année : ${nf0.format(lo)} à ${nf0.format(hi)} mm · ${nf1.format(t/NY)} °C`, e.clientX, e.clientY); });
$('#rain').addEventListener('pointerleave', hideTip);
document.addEventListener('pointermove', e=>{ if (!tip.hidden && !e.target.closest('#heat, #bars, #rain')) hideTip(); }, {passive:true});
document.addEventListener('pointerdown', e=>{ if (!e.target.closest('#heat, #bars, #rain')) hideTip(); }, {passive:true});
window.addEventListener('scroll', hideTip, {passive:true});

/* ---------- Mise à jour ---------- */
function update(){ computeFuel(); resolveLoc(); syncControls(); buildCal(); computeAll(); renderStatus(); renderNow(); renderHeat(); renderDetail(); renderClimate(); renderHyp(); renderEnso(); renderCarnet(); save(); }
/* ---------- Guide de départ ---------- */
const OB = {step:1, lieu:null, conduite:'sec', surface:1000, conso:10, fuel:'gazole'};
function obRender(){
  document.querySelectorAll('.ob-step').forEach(el=> el.hidden = +el.dataset.step !== OB.step);
  document.querySelectorAll('.ob-steps span').forEach(el=> el.classList.toggle('on', +el.dataset.s <= OB.step));
  $('#obBack').hidden = OB.step===1; $('#obNext').textContent = OB.step===3 ? 'Voir mes conseils' : 'Suivant';
  document.querySelectorAll('#obCond button').forEach(b=>b.setAttribute('aria-pressed', b.dataset.v===OB.conduite));
  document.querySelectorAll('#obVeh button').forEach(b=>b.setAttribute('aria-pressed', +b.dataset.v===OB.conso));
  document.querySelectorAll('#obFuel button').forEach(b=>b.setAttribute('aria-pressed', b.dataset.v===OB.fuel));
  $('#obSurf').value = OB.surface;
}
function obOpen(){
  Object.assign(OB, {step:1, lieu:null, conduite:state.conduite, surface:state.surface, conso:state.conso, fuel:state.fuel});
  $('#obLieu').innerHTML = $('#lieu').innerHTML; $('#obLieu').value = state.lieu.mode==='node' ? state.lieu.id : 'cayenne';
  $('#obLieuInfo').textContent = ''; $('#onboard').hidden = false; $('#settings').open = false; obRender();
  $('#onboard').scrollIntoView({block:'start'}); $('#obLieu').focus({preventScroll:true});
}
function obClose(apply){
  if (apply){ state.lieu = OB.lieu || {mode:'node', id:$('#obLieu').value}; Object.assign(state, {conduite:OB.conduite, surface:OB.surface, conso:OB.conso, fuel:OB.fuel}); }
  state.onboarded = true; $('#onboard').hidden = true; update();
  if (apply) $('#now').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start'});
}
$('#obLieu').addEventListener('change', ()=>{ OB.lieu = null; $('#obLieuInfo').textContent = ''; });
$('#obGps').addEventListener('click', ()=>{
  const fail = () => { $('#obLieuInfo').textContent = 'Localisation indisponible ici : choisissez votre commune dans la liste.'; };
  try { if (!navigator.geolocation) return fail(); $('#obLieuInfo').textContent = 'Recherche de votre position…';
    navigator.geolocation.getCurrentPosition(pos=>{ const la = pos.coords.latitude, lo = pos.coords.longitude;
      if (!inGuyane(la, lo)) { $('#obLieuInfo').textContent = 'Votre position est hors de Guyane : choisissez votre commune dans la liste.'; return; }
      OB.lieu = {mode:'gps', lat:la, lon:lo}; const r = locate(la, lo); $('#obLieuInfo').textContent = `Position trouvée, près de ${r.near.nom}.`; }, fail, {enableHighAccuracy:true, timeout:15000, maximumAge:600000}); } catch(e){ fail(); }
});
$('#obCond').addEventListener('click', e=>{ const b = e.target.closest('button'); if (!b) return; OB.conduite = b.dataset.v; obRender(); });
$('#obVeh').addEventListener('click', e=>{ const b = e.target.closest('button'); if (!b) return; OB.conso = +b.dataset.v; obRender(); });
$('#obFuel').addEventListener('click', e=>{ const b = e.target.closest('button'); if (!b) return; OB.fuel = b.dataset.v; obRender(); });
$('#obSurf').addEventListener('input', e=>{ const v = parseFloat(e.target.value); if (v>0) OB.surface = v; });
$('#obNext').addEventListener('click', ()=>{ if (OB.step < 3){ OB.step++; obRender(); } else obClose(true); });
$('#obBack').addEventListener('click', ()=>{ if (OB.step > 1){ OB.step--; obRender(); } });
$('#obSkip').addEventListener('click', ()=> obClose(false));
$('#obAgain').addEventListener('click', obOpen);

initControls();
state.week = 0; update();
if (!state.onboarded) obOpen();
state.week = bestWeek(state.crop); renderDetail(); markHeatSel();
/* ---------- Archives : fichiers du site, puis base Supabase si elle est plus récente ---------- */
const getJSON = u => fetch(u, {cache:'no-cache'}).then(r=> r.ok ? r.json() : null).catch(()=>null);
const plusRecent = (neuf, actuel) => !actuel || !actuel.maj || (neuf && neuf.maj && neuf.maj >= actuel.maj);
function appliquerArchives({climat:cj, mercuriales:mj, carburant:fj, enso:ej}){
  let changed = false;
  if (ej && ej.saisons && ej.prevision && plusRecent(ej, ENSO)){ ENSO = ej; changed = true; }
  if (cj && cj.stations && ['cay','kou','slm','stg','mar'].every(id=>cj.stations[id] && cj.stations[id].annees) && plusRecent(cj, CLIMAT)){ CLIMAT = cj; for (const k in SER) delete SER[k]; changed = true; }
  if (fj && fj.mois && plusRecent(fj, CARBU) && Object.keys(fj.mois).length >= Object.keys(CARBU.mois).length){ CARBU = fj; changed = true; }
  if (mj && Array.isArray(mj.releves) && mj.releves.length && plusRecent(mj, OFFICIEL)){
    const rel = mj.releves.filter(r=>r && CROP[r.produit] && (!r.marche || r.marche==='guyane' || MKT[r.marche]) && +r.prix>0);
    if (rel.length){ OFFICIEL = {maj:mj.maj||null, releves:rel, familles:Array.isArray(mj.familles) ? mj.familles : (OFFICIEL.familles||[])}; changed = true; }
  }
  if (changed){ const keep = state.week; update(); state.week = keep; renderDetail(); markHeatSel(); }
}
Promise.all([getJSON('data/climat.json'), getJSON('data/mercuriales.json'), getJSON('data/carburant.json'), getJSON('data/enso.json')])
  .then(([cj, mj, fj, ej])=>appliquerArchives({climat:cj, mercuriales:mj, carburant:fj, enso:ej}));

/* ---------- Passerelle avec js/cloud.js (comptes et sauvegarde) ---------- */
window.CMG = {
  etat: () => JSON.parse(JSON.stringify(state)),
  appliquer: (partiel) => { const keep = state.week; Object.assign(state, partiel); if (!Array.isArray(state.parcelles)) state.parcelles = []; if (!Array.isArray(state.plantations)) state.plantations = []; if (partiel.onboarded) $('#onboard').hidden = true; update(); state.week = keep; renderDetail(); markHeatSel(); },
  archives: appliquerArchives
};
})();

