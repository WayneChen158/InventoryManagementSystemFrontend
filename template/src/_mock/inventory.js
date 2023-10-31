const csvData = `group_name,catalog_num,description,manufacturer,concentration,receive_date,threshold,amount_in_stock
1,B0538B,10X Mg free isothermal buffer,NEB,10,2023-10-01,100,2500
1,T8787-250ML,Triton X-100(T8787-250ML),Sigma,125,2023-10-02,50,6600
1,15568025,Invitrogen UltraPure 1M Tris-HCI pH 8.0,FisherSci,1,2023-10-03,75,1800
1,CR,cRNA,SZ Mebep,1,2023-10-04,40,1200
1,c4706-50g,TCEP,Sigma,1,2023-10-05,60,2200
1,10977-015,Invitrogen UltraPure Dnase RNase-Free Distilled Water,FisherSci,NULL,2023-10-06,30,800
1,RI,Vazyme RI,Vazyme,NULL,2023-10-07,90,2700
1,dATP,dATPs (25mM each),SZ Mebep,NULL,2023-10-08,25,700
1,dTTP,dTTPs (25mM each),SZ Mebep,NULL,2023-10-08,25,700
1,dCTP,dCTPs (25mM each),SZ Mebep,NULL,2023-10-08,25,700
1,dGTP,dGTPs (25mM each),SZ Mebep,NULL,2023-10-08,25,700
1,dUTP,dUTPs (100mM),SZ Mebep,NULL,2023-10-09,120,3800
1,c0759-500g,Na3Citrate (1M),Sigma,NULL,2023-10-10,80,1900
1,71289-50G,NaN3,Sigma,NULL,2023-10-01,100,2500
1,G9391-500G,Bovine Gelatin (Gelatin from bovine skin),Sigma,NULL,2023-10-02,50,1500
1,E3889-100G,EGTA,Sigma,NULL,2023-10-03,75,1800
1,M0538L,WS-Bst 2.0,NEB,NULL,2023-10-04,40,1200
1,M0380L,WS RT enzyme,NEB,NULL,2023-10-05,60,2200
1,UDG,UDG,SZ Mebep,NULL,2023-10-06,30,800
1,Oligo,oligo,IDT,NULL,2023-10-01,90,2700
1,83266,Magnesium sulfate solution-500mL (2.5M),Sigma,NULL,2023-10-02,25,2500
1,14300-500G,Betaine (5M),Sigma,NULL,2023-10-03,100,1500
1,Vazyme ws BsT,Vazyme ws BsT,Vazyme,NULL,2023-10-09,25,3800
2,Hemo LF-Hex,HemoIC oligo sequence,IDT,300,2023-10-10,20000,200000
2,BTQ77,HemoIC oligo sequence,IDT,300,2023-10-11,20000,200000
2,Hemo-F3,HemoIC oligo sequence,IDT,1000,2023-10-12,20000,200000`;

const rows = csvData.split('\n');
const headers = rows[0].split(',');

export const inventoryData = rows.slice(1).map((row, index) => {
  const values = row.split(',');
  const jsonRow = { id: index + 1 };
  headers.forEach((header, i) => {
    jsonRow[header] = values[i];
  });
  return jsonRow;
});