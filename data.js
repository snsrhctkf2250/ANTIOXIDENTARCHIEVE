// 빛결 연구 자료: 제공받은 최종 측정값만 기록합니다.
window.BITGYEOL_DATA = {
  control: {name:"대조군", rgb:{r:244,g:216,b:234}, note:"DPPH 용액만 측정한 대조군"},
  blank: {name:"아로니아 + 에탄올 블랭크", rgb:{r:239,g:218,b:211}, note:"아로니아와 에탄올만 혼합해 측정한 값. 모든 시료에 공통 적용되는 블랭크가 아님."},
  controlG:216,
  samples:[
    {id:"vitc",name:"비타민 C",amount:0.5,rgb:{r:239,g:241,b:228}},
    {id:"vitc",name:"비타민 C",amount:1.0,rgb:{r:255,g:247,b:226}},
    {id:"vitc",name:"비타민 C",amount:1.5,rgb:{r:250,g:248,b:230}},
    {id:"glutathione",name:"글루타티온 함유 시료",amount:0.5,rgb:{r:237,g:234,b:223}},
    {id:"glutathione",name:"글루타티온 함유 시료",amount:1.0,rgb:{r:255,g:244,b:227}},
    {id:"glutathione",name:"글루타티온 함유 시료",amount:1.5,rgb:{r:255,g:248,b:229}},
    {id:"greentea",name:"녹차",amount:0.5,rgb:{r:247,g:239,b:223}},
    {id:"greentea",name:"녹차",amount:1.0,rgb:{r:255,g:241,b:218}},
    {id:"greentea",name:"녹차",amount:1.5,rgb:{r:253,g:244,b:224}},
    {id:"aronia",name:"아로니아",amount:0.5,rgb:{r:68,g:60,b:76}},
    {id:"aronia",name:"아로니아",amount:1.0,rgb:{r:84,g:63,b:78}},
    {id:"aronia",name:"아로니아",amount:1.5,rgb:{r:202,g:148,b:135}}
  ],
  finalChanges:[
    {amount:0.5,vitc:11.57,glutathione:8.33,greentea:10.65,aronia:-72.22},
    {amount:1.0,vitc:14.35,glutathione:12.96,greentea:11.57,aronia:-70.83},
    {amount:1.5,vitc:14.81,glutathione:14.81,greentea:12.96,aronia:-31.48}
  ],
  materials:[
    {id:"vitc",name:"비타민 C",type:"비타민·비교 시료",form:"실험에 사용한 비타민 C 분말",components:"아스코르브산(비타민 C)",mechanism:"전자 또는 수소를 제공하는 환원성 물질로 산화·환원 반응에 참여한다.",use:"식품·영양 분야의 항산화 성분 연구를 위한 비교 시료로 활용 가능. 본 실험만으로 건강상 효과를 판정하지 않는다.",source:"https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/"},
    {id:"glutathione",name:"글루타티온 함유 시료",type:"제품 기반 시료",form:"글루타티온이 함유된 제품. 순수 글루타티온 시료가 아님.",components:"글루타티온 함유. 제품의 다른 성분 및 함량은 제품 표시 자료 확인 필요.",mechanism:"글루타티온(GSH)은 생체 내 산화·환원 균형과 항산화 방어 체계에 관여한다. 제품 전체의 작용을 순수 GSH와 동일시할 수 없다.",use:"제품 기반 시료와 순수 성분 시료를 구분하는 비교 연구에 참고 가능.",source:""},
    {id:"greentea",name:"녹차",type:"식물 유래 시료",form:"실험에 사용한 녹차 시료. 정확한 추출 조건은 실험 기록에 따름.",components:"녹차 카테킨류(예: EGCG, EGC, ECG 등)가 주요 폴리페놀 성분으로 보고된다. 사용 시료의 실제 함량은 측정하지 않음.",mechanism:"카테킨류는 시험관 내 조건에서 라디칼과 반응하거나 산화·환원 과정에 관여할 수 있다. 효과는 농도와 조건에 따라 달라진다.",use:"식물 유래 폴리페놀 시료의 색 변화 비교 및 후속 추출 조건 연구에 참고 가능.",source:"https://pmc.ncbi.nlm.nih.gov/articles/PMC8614888/"},
    {id:"aronia",name:"아로니아",type:"식물·색소 특성 시료",form:"실험에 사용한 아로니아 추출 시료. 정확한 추출 조건은 실험 기록에 따름.",components:"아로니아에는 안토시아닌, 플라바놀, 플라보놀, 페놀산 등 폴리페놀 성분이 보고된다. 본 시료의 개별 성분 함량은 측정하지 않음.",mechanism:"일부 폴리페놀은 라디칼 소거 반응에 관여할 수 있다. 아로니아 자체의 짙은 색은 RGB 측정값에 영향을 줄 수 있어 시료 색상과 DPPH 반응을 구분해 해석해야 한다.",use:"색이 강한 식물 추출물의 블랭크 설정과 색상 간섭을 고려하는 후속 방법 탐구에 참고 가능.",source:"https://pmc.ncbi.nlm.nih.gov/articles/PMC11352306/"}
  ],
  references:[
    {title:"Antioxidant Determinations by the Use of a Stable Free Radical",author:"Marsden S. Blois",year:"1958",note:"DPPH를 이용한 초기 항산화 평가 방법 관련 논문",url:"https://www.nature.com/articles/1811199a0"},
    {title:"Genesis and development of DPPH method of antioxidant assay",author:"Kedare & Singh",year:"2011",note:"DPPH 분석법의 원리와 방법을 정리한 리뷰",url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC3551182/"},
    {title:"A Simple Minimized System Based on Moving Drops for Antioxidant Analysis Using a Smartphone",author:"연구 논문 (PubMed Central)",year:"2021",note:"스마트폰 색상 신호를 이용한 DPPH 분석 사례. 이 웹사이트의 상대 변화율과 같은 계산법은 아님.",url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC8510342/"},
    {title:"Vitamin C — Fact Sheet for Health Professionals",author:"U.S. National Institutes of Health, Office of Dietary Supplements",year:"웹 자료",note:"비타민 C의 기능 및 항산화 관련 공식 자료",url:"https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/"},
    {title:"Effect of Green Tea Supplementation on Antioxidant Status in Adults: A Systematic Review and Meta-Analysis",author:"연구 논문 (PubMed Central)",year:"2021",note:"녹차의 카테킨류 및 항산화 관련 문헌",url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC8614888/"},
    {title:"Functional Activities and Mechanisms of Aronia melanocarpa in Our Health",author:"Go et al.",year:"2024",note:"아로니아의 폴리페놀과 안토시아닌 관련 리뷰",url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC11352306/"}
  ]
};
