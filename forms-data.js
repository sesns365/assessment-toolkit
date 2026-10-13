window.FORM_DEFINITIONS = {
  "learning": {
    "title": "學習障礙鑑定導師訪談表",
    "description": "依導師的課堂、作業與評量觀察，記錄個案七項基本學業能力、適應情形及教學介入後表現，供後續評估整合使用。",
    "download": "downloads/learning.docx",
    "sections": [
      {
        "id": "basic",
        "title": "基本資料",
        "description": "請依本次訪談填寫。",
        "fields": [
          {
            "id": "basic-1",
            "label": "學校",
            "type": "text"
          },
          {
            "id": "basic-2",
            "label": "年級與班級",
            "type": "text"
          },
          {
            "id": "basic-3",
            "label": "個案姓名或代號",
            "type": "text"
          },
          {
            "id": "basic-4",
            "label": "訪談日期",
            "type": "date"
          },
          {
            "id": "basic-5",
            "label": "受訪導師",
            "type": "text"
          },
          {
            "id": "basic-6",
            "label": "訪談者",
            "type": "text"
          },
          {
            "id": "basic-7",
            "label": "導師任教期間",
            "type": "text"
          },
          {
            "id": "basic-8",
            "label": "本次觀察期間",
            "type": "text"
          }
        ]
      },
      {
        "id": "opening",
        "title": "訪談起點",
        "description": "訪談與記錄方式\n1. 先問可獨立完成的部分，再問需要協助的情形；以目前年級已教內容為範圍。\n2. 以近期事例記錄任務、日期、正確情形、時間與提示程度；同年級比較以相近教學及任務為原則。\n3. 可依需要選問；未觀察或未教過請註記。空白欄可直接打字，也可列印手寫。",
        "fields": [
          {
            "id": "opening-1",
            "label": "1. 個案較拿手、感興趣或能獨立完成的課程與活動有哪些？請舉最近的例子。",
            "type": "textarea"
          },
          {
            "id": "opening-2",
            "label": "2. 目前最需要了解的學習情形是什麼？何時開始出現，持續多久，對課堂學習有何影響？",
            "type": "textarea"
          }
        ]
      },
      {
        "id": "ability-1",
        "title": "（一）聽覺理解",
        "description": "分別記錄當下聽懂、稍後記住，以及能否執行；可用動作或指認確認理解。",
        "fields": [
          {
            "id": "ability-1-1",
            "label": "1. 不看文字、只聽口頭說明時，個案能理解哪些內容？熟悉與新內容、一步與多步驟指令的表現有何不同？",
            "type": "textarea"
          },
          {
            "id": "ability-1-2",
            "label": "2. 聽完說明或短故事後，個案能否以動作、指認或口述呈現理解？請舉例說明能掌握哪些訊息，哪些需要澄清。",
            "type": "textarea"
          },
          {
            "id": "ability-1-3",
            "label": "3. 與同年級同任務相比，個案需要多少等待或重複？若未完成指令，是未注意、當下不懂、稍後忘記，還是尚未開始？",
            "type": "textarea"
          },
          {
            "id": "ability-1-4",
            "label": "4. 在個別提醒、簡短語句、分步說明、示範或圖片支持下，理解與執行有何改變？哪些支持較有幫助？",
            "type": "textarea"
          },
          {
            "id": "ability-1-summary",
            "label": "補充與小結",
            "type": "textarea",
            "hint": "可記作品日期、表現頻率、正確情形、完成時間或待補資料。"
          }
        ]
      },
      {
        "id": "ability-2",
        "title": "（二）口語表達",
        "description": "分別記錄表達內容、組織與發音清晰度；留意個別談話與全班發言的差異。",
        "fields": [
          {
            "id": "ability-2-1",
            "label": "1. 個案平時如何表達需求、想法或經驗？日常聊天、回答課堂問題及向全班發言時，表現有何不同？",
            "type": "textarea"
          },
          {
            "id": "ability-2-2",
            "label": "2. 請舉近期回答或敘事的例子：使用哪些詞語與句子？聽者能否理解？能否交代人物、事情及先後順序？",
            "type": "textarea"
          },
          {
            "id": "ability-2-3",
            "label": "3. 在已理解且熟悉的主題上，個案的表達內容、組織與所需時間，和同年級相比如何？發音是否影響他人理解？",
            "type": "textarea"
          },
          {
            "id": "ability-2-4",
            "label": "4. 給予等待時間、圖片、關鍵詞、句型或追問後，表達有何改變？哪些內容能自行補充，哪些仍需提示？",
            "type": "textarea"
          },
          {
            "id": "ability-2-summary",
            "label": "補充與小結",
            "type": "textarea",
            "hint": "可記作品日期、表現頻率、正確情形、完成時間或待補資料。"
          }
        ]
      },
      {
        "id": "ability-3",
        "title": "（三）識字",
        "description": "分別記錄無注音認讀、注音拼讀與短文朗讀；已教與尚未教過的內容要分開。",
        "fields": [
          {
            "id": "ability-3-1",
            "label": "1. 對近期已教的國字與語詞，個案能獨立認讀哪些？單獨呈現、放在句子中，以及有無注音時，表現有何不同？",
            "type": "textarea"
          },
          {
            "id": "ability-3-2",
            "label": "2. 請舉近期認讀或朗讀實例：正確性、停頓、速度及自我修正如何？若有誤讀、漏讀或猜讀，實際讀成什麼？",
            "type": "textarea"
          },
          {
            "id": "ability-3-3",
            "label": "3. 與同年級認讀相同材料相比，個案需要多少時間與提示？隔天或隔週再出現時，哪些仍能認讀？注音拼讀情形如何？",
            "type": "textarea"
          },
          {
            "id": "ability-3-4",
            "label": "4. 使用部件、圖片、語境提示或反覆練習後，認讀有何改變？移除提示、調換順序或換句子後，能否仍獨立認讀？",
            "type": "textarea"
          },
          {
            "id": "ability-3-summary",
            "label": "補充與小結",
            "type": "textarea",
            "hint": "可記作品日期、表現頻率、正確情形、完成時間或待補資料。"
          }
        ]
      },
      {
        "id": "ability-4",
        "title": "（四）閱讀理解",
        "description": "分別記錄自行閱讀與成人報讀後的理解；口頭回答與書寫作答也要區分。",
        "fields": [
          {
            "id": "ability-4-1",
            "label": "1. 自行閱讀目前教學範圍的句子或短文時，個案能理解哪些內容？找明確訊息、排事件順序、推論原因及說重點的表現如何？",
            "type": "textarea"
          },
          {
            "id": "ability-4-2",
            "label": "2. 請以近期文章與題目舉例：個案如何找答案？能否指出文中依據，理解詞義、前後句關係，並用自己的話說明？",
            "type": "textarea"
          },
          {
            "id": "ability-4-3",
            "label": "3. 與同年級閱讀相同材料相比，理解、完成時間及獨立作答如何？改用口頭回答，或改變文章長度與詞語熟悉度後，有何差異？",
            "type": "textarea"
          },
          {
            "id": "ability-4-4",
            "label": "4. 在相近難度材料中，分別提供單純報讀、詞義說明、分段閱讀或圖示後，理解有何改變？請記明實際提供的支持。",
            "type": "textarea"
          },
          {
            "id": "ability-4-summary",
            "label": "補充與小結",
            "type": "textarea",
            "hint": "可記作品日期、表現頻率、正確情形、完成時間或待補資料。"
          }
        ]
      },
      {
        "id": "ability-5",
        "title": "（五）寫字",
        "description": "分別記錄看範本抄寫、看黑板抄寫、聽寫，以及已教過的看注音寫國字。",
        "fields": [
          {
            "id": "ability-5-1",
            "label": "1. 對已教的國字，個案在近距離抄寫、看黑板抄寫、聽寫及看注音寫國字時，各能獨立完成到什麼程度？",
            "type": "textarea"
          },
          {
            "id": "ability-5-2",
            "label": "2. 請以近期作品舉例：字形、部件、筆畫、大小及行列對齊如何？若有錯誤，實際寫成什麼？抄寫時是否漏字或漏行？",
            "type": "textarea"
          },
          {
            "id": "ability-5-3",
            "label": "3. 與同年級完成相同任務相比，正確性、速度及所需協助如何？握筆或運筆是否費力？書寫量增加時，有無疲累、疼痛或變化？",
            "type": "textarea"
          },
          {
            "id": "ability-5-4",
            "label": "4. 使用大字格、部件提示、近距離範本或減少抄寫量後，表現有何改變？移除字形提示或隔一段時間再寫時，表現如何？",
            "type": "textarea"
          },
          {
            "id": "ability-5-summary",
            "label": "補充與小結",
            "type": "textarea",
            "hint": "可記作品日期、表現頻率、正確情形、完成時間或待補資料。"
          }
        ]
      },
      {
        "id": "ability-6",
        "title": "（六）書寫表達",
        "description": "分別記錄想法與組織、國字提取及手寫速度；依年級選問造句、段落或作文。",
        "fields": [
          {
            "id": "ability-6-1",
            "label": "1. 依目前已教的寫作要求，個案能獨立完成哪些造句、段落或作文任務？通常如何想內容、開始並完成？",
            "type": "textarea"
          },
          {
            "id": "ability-6-2",
            "label": "2. 對同一主題，個案口頭能說出的內容與實際寫出的內容有何差異？請提供最近一次口述與書面作品的例子。",
            "type": "textarea"
          },
          {
            "id": "ability-6-3",
            "label": "3. 近期作品是否切題、句意清楚、前後連貫？用詞與標點如何？完成量、時間及自行檢查修改的情形，與同年級同任務相比如何？",
            "type": "textarea"
          },
          {
            "id": "ability-6-4",
            "label": "4. 提供圖片、詞語、句型、提綱、先說再寫，或改用打字、口述代筆後，內容與組織有何改變？請註明成人協助到哪一步。",
            "type": "textarea"
          },
          {
            "id": "ability-6-summary",
            "label": "補充與小結",
            "type": "textarea",
            "hint": "可記作品日期、表現頻率、正確情形、完成時間或待補資料。"
          }
        ]
      },
      {
        "id": "ability-7",
        "title": "（七）數學運算",
        "description": "依已教範圍選問；分開了解數量與位值、列出算式後的計算，以及文字題理解。",
        "fields": [
          {
            "id": "ability-7-1",
            "label": "1. 就目前已教範圍，個案對數量、位值及加減乘除的掌握如何？哪些能獨立完成？口算、筆算及基本算式熟練情形有何不同？",
            "type": "textarea"
          },
          {
            "id": "ability-7-2",
            "label": "2. 請以近期題目說明計算步驟：若有錯誤，出現在符號、位值對齊、基本計算、進退位或哪個步驟？能否說明自己的做法？",
            "type": "textarea"
          },
          {
            "id": "ability-7-3",
            "label": "3. 與同年級相同任務相比，正確性、速度及協助需求如何？相同運算的算式題與文字題有何差異？讀懂題意、選算式與計算各如何？",
            "type": "textarea"
          },
          {
            "id": "ability-7-4",
            "label": "4. 使用實物、數線、位值表、分步提示或加強練習後，計算有何改變？撤除提示、改換題目或隔一段時間再做時，能否運用？",
            "type": "textarea"
          },
          {
            "id": "ability-7-summary",
            "label": "補充與小結",
            "type": "textarea",
            "hint": "可記作品日期、表現頻率、正確情形、完成時間或待補資料。"
          }
        ]
      },
      {
        "id": "adaptation",
        "title": "課堂學習與適應狀況",
        "description": "請記錄情境、出現頻率、持續時間、對學習的影響及可協助恢復參與的方式。",
        "fields": [
          {
            "id": "adaptation-1",
            "label": "1. 注意與課堂參與個案在哪些課程較能投入？在聽講、操作與獨立作業時，各能持續多久？分心時如何回到任務，通常需要哪些提醒？",
            "type": "textarea"
          },
          {
            "id": "adaptation-2",
            "label": "2. 指令記憶與任務管理個案能否記住步驟、準備用品、找到頁次及轉換活動？遇到多步驟任務時，如何開始、接續並完成？",
            "type": "textarea"
          },
          {
            "id": "adaptation-3",
            "label": "3. 作業與評量課堂作業、回家作業及限時評量的完成量與正確性如何？未完成時卡在哪一步？延長時間、分段或報讀後，有何改變？",
            "type": "textarea"
          },
          {
            "id": "adaptation-4",
            "label": "4. 情緒與挫折反應遇到不會、做錯、被提醒或時間不足時，個案通常如何反應？多久能恢復參與？哪些安撫、引導或任務調整有效？",
            "type": "textarea"
          },
          {
            "id": "adaptation-5",
            "label": "5. 同儕互動與求助與教師及同儕互動、分組合作和遵守活動規則的情形如何？能否提出具體求助？被拒絕或意見不同時，如何回應？",
            "type": "textarea"
          },
          {
            "id": "adaptation-6",
            "label": "6. 生活與環境適應整理書包用品、交作業、作息轉換及在校自我照顧的情形如何？座位、噪音、視覺提示或同儕支持對表現有何影響？",
            "type": "textarea"
          }
        ]
      },
      {
        "id": "background",
        "title": "學習經驗與相關背景",
        "description": "請區分導師直接觀察、家長轉述及已有紀錄；不清楚的部分可註記待確認。",
        "fields": [
          {
            "id": "background-1",
            "label": "1. 相關內容是否已教過並有練習機會？出缺席、轉學、教學銜接、課後協助或使用語言，有哪些情形需要一併了解？",
            "type": "textarea"
          },
          {
            "id": "background-2",
            "label": "2. 已知視力、聽力、健康、睡眠或情緒狀況是否影響上課？平日需要哪些支持？請說明觀察到的事實或現有資料。",
            "type": "textarea"
          }
        ]
      },
      {
        "id": "intervention",
        "title": "教學介入與成效紀錄",
        "description": "請選一至兩項主要學習目標，具體說明做法、實施量及前後表現；必要時可複製表列。",
        "fields": [
          {
            "id": "intervention-1",
            "label": "1. 介入目標與起點針對哪一項學習困難提供教學？預計個案學會什麼？介入前，在何種任務及提示條件下，正確情形、完成量或時間為何？",
            "type": "textarea"
          },
          {
            "id": "intervention-2",
            "label": "2. 實際方法與安排由誰、在何種情境實施？教什麼內容、如何示範、練習及回饋？與原先做法相比，有何具體調整？",
            "type": "textarea"
          },
          {
            "id": "intervention-3",
            "label": "3. 期間與實施量起訖日期為何？每週幾次、每次幾分鐘、約幾週？個案實際參與幾次？是否中斷或缺席？",
            "type": "textarea"
          },
          {
            "id": "intervention-4",
            "label": "4. 進步、保留與運用介入後哪些表現改變、哪些仍困難？在相近難度與相同提示條件下，前後差多少？減少提示、隔時或換題後，表現如何？",
            "type": "textarea"
          }
        ]
      },
      {
        "id": "evidence",
        "title": "可提供的佐證資料",
        "description": "",
        "fields": [
          {
            "id": "evidence-1",
            "label": "近期作業、聽寫或朗讀紀錄、作文、數學題目、課堂觀察、評量、學習扶助或教學介入紀錄。請記明題目、年級範圍及作答時的協助。",
            "type": "textarea",
            "hint": "日期與內容或待補事項"
          }
        ]
      },
      {
        "id": "summary",
        "title": "訪談綜合紀錄",
        "description": "",
        "fields": [
          {
            "id": "summary-1",
            "label": "相對優勢與可獨立表現",
            "type": "textarea"
          },
          {
            "id": "summary-2",
            "label": "持續困難與學習適應影響",
            "type": "textarea"
          },
          {
            "id": "summary-3",
            "label": "有效支持與仍需協助部分",
            "type": "textarea"
          },
          {
            "id": "summary-4",
            "label": "待補資料與後續評估重點",
            "type": "textarea"
          }
        ]
      }
    ]
  },
  "emotional": {
    "title": "115學年度版嘉義縣情緒行為障礙學生訪談紀錄表",
    "description": "(本表由鑑定評估人員填寫，視需求自行增減表格，受訪者須簽名)",
    "download": "downloads/emotional.docx",
    "sections": [
      {
        "id": "basic",
        "title": "基本資料",
        "description": "(本表由鑑定評估人員填寫，視需求自行增減表格，受訪者須簽名)",
        "fields": [
          {
            "id": "school",
            "label": "學校",
            "type": "text"
          },
          {
            "id": "student",
            "label": "學生姓名",
            "type": "text"
          },
          {
            "id": "interviewer",
            "label": "晤談者（鑑定評估人員）",
            "type": "text"
          },
          {
            "id": "guardian-name",
            "label": "（一）受訪者（法定代理人或實際照顧者）",
            "type": "text"
          },
          {
            "id": "guardian-relationship",
            "label": "（一）受訪者（法定代理人或實際照顧者）－關係",
            "type": "text"
          },
          {
            "id": "guardian-time",
            "label": "（一）受訪者（法定代理人或實際照顧者）－晤談時間",
            "type": "text",
            "hint": "可填寫日期與時間。"
          },
          {
            "id": "teacher-name",
            "label": "（二）受訪者（班級導師）",
            "type": "text"
          },
          {
            "id": "teacher-relationship",
            "label": "（二）受訪者（班級導師）－關係",
            "type": "text"
          },
          {
            "id": "teacher-time",
            "label": "（二）受訪者（班級導師）－晤談時間",
            "type": "text",
            "hint": "可填寫日期與時間。"
          },
          {
            "id": "other-name",
            "label": "（三）受訪者（相關人員）",
            "type": "text"
          },
          {
            "id": "other-relationship",
            "label": "（三）受訪者（相關人員）－關係",
            "type": "text"
          },
          {
            "id": "other-time",
            "label": "（三）受訪者（相關人員）－晤談時間",
            "type": "text",
            "hint": "可填寫日期與時間。"
          }
        ]
      },
      {
        "id": "interview-1",
        "title": "就醫過程(新個案必填)",
        "description": "1.何時就醫？持續就醫時間？最近一次就醫時間及狀況？\n2.醫生是否建議用藥？劑量？用藥成效？如果尚未用藥，未用藥原因？藥物如何影響學生的行為?\n3.是否接受相關治療？治療頻率？持續時間？治療方式？成效如何？\n4.任何可能會影響學生行為問題的疾病或生理狀況(包括: 氣喘、過敏、癲癇、和生理期的問題…)",
        "fields": [
          {
            "id": "interview-1-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-1-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-1-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-2",
        "title": "早期療育過程(新個案必填)",
        "description": "接受早期療育之狀況？何時？接受何種項目？持續時間？頻率？效果如何？",
        "fields": [
          {
            "id": "interview-2-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-2-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-2-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-3",
        "title": "孩子的聽覺理解能力",
        "description": "孩子的聽覺理解能力如何？例如誤解別人說話的意思？指令需要重複幾次？",
        "fields": [
          {
            "id": "interview-3-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-3-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-3-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-4",
        "title": "孩子的表達溝通能力",
        "description": "孩子的口語表達能力如何？說的話別人容易聽懂嗎？說的內容、時機恰當嗎？會不會主動與人交談或主動表達需求？能加入團體的討論或與人交換意見？",
        "fields": [
          {
            "id": "interview-4-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-4-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-4-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-5",
        "title": "五、孩子首次發生問題行為(訪問法定代理人或實際照顧者及教師) (新個案必填)",
        "description": "第一次在什麼時候出現問題行為？是誰發現？當時有沒有特殊情況發生？如：家庭衝突、搬家、親人身亡、轉學、轉換班級或老師等？",
        "fields": [
          {
            "id": "interview-5-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-5-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-5-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-6",
        "title": "六、孩子目前的主要問題行為 (訪問法定代理人或實際照顧者及教師)",
        "description": "目前主要困擾的問題是甚麼？發生頻率？嚴重性？是誰發現？有沒有特殊情況發生？處理方式？",
        "fields": [
          {
            "id": "interview-6-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-6-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-6-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-7",
        "title": "七、孩子目前的情緒狀況 (訪問法定代理人或實際照顧者及教師)",
        "description": "1.孩子是否曾經有幻覺、妄想、思考異常或情緒異常現象？出現頻率？舉例說明\n2.容易憂鬱、長期情緒低落、脾氣暴躁、容易躁動、容易畏懼，其程度到超出現實狀況？舉例說明\n3.行為是否有衝動/過動/注意力不足狀況？出現頻率？舉例說明\n4.對環境的適應時間及接受度？堅持度？",
        "fields": [
          {
            "id": "interview-7-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-7-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-7-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-8",
        "title": "八、情緒或行為問題對學業適應的影響",
        "description": "衝動/過動/注意力/其他情緒問題，對於其學習的影響？功課的完成狀況？其學業的表現？\n其是否有自覺？是否能自我調適？在不同情境(安親班、班級或科任教室)中的影響？舉例說明。",
        "fields": [
          {
            "id": "interview-8-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-8-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-8-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-9",
        "title": "九、情緒或行為問題對人際關係的影響",
        "description": "衝動/過動/注意力/其他情緒問題，是否會影響其在學校與教師或同儕建立或維持適當的人際關係？其是否有自覺？舉例說明。",
        "fields": [
          {
            "id": "interview-9-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-9-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-9-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-10",
        "title": "十、情緒或行為問題對社會適應的影響",
        "description": "衝動/過動/注意力/其他情緒問題，是否會影響其參與團體學習、活動、生活？在學校團體生活中有干擾或危險行為？其是否有自覺？舉例說明。",
        "fields": [
          {
            "id": "interview-10-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-10-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-10-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-11",
        "title": "十一、情緒或行為問題對生活適應的影響",
        "description": "衝動/過動/注意力/其他情緒問題，是否會影響其生活適應？其是否有自覺？舉例說明。",
        "fields": [
          {
            "id": "interview-11-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-11-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-11-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-12",
        "title": "十二、孩子曾經接受過之一般輔導措施？",
        "description": "接受過認輔制度或輔導老師的狀況？社會公益團體或民間協會的輔導？\n學校申請之醫療體系的治療(心理諮商師)？次數？輔導方式？輔導期間？成效如何？進步的地方？",
        "fields": [
          {
            "id": "interview-12-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-12-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-12-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-13",
        "title": "十三、孩子目前接受特教服務情況 (訪問法定代理人或實際照顧者、導師及相關人員)",
        "description": "接受特教服務的狀況？孩子是否曾經入資源班？期間有多久？課程頻率？特教老師協助的方式？\n孩子接受特教服務後的情況？進步的地方？在普通班的影響？進入下一個教育階段，是否覺得有必要特教老師持續協助？為什麼？若是該項服務已終止，請說明當時終止的原因？",
        "fields": [
          {
            "id": "interview-13-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-13-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-13-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "student-interview",
        "title": "十四、訪談學生",
        "description": "",
        "fields": [
          {
            "id": "student-1",
            "label": "1.學生自我介紹：",
            "type": "textarea"
          },
          {
            "id": "student-2",
            "label": "2.學生說明家庭成員及其關係：",
            "type": "textarea"
          },
          {
            "id": "student-3",
            "label": "3.學生說明與同儕關係：",
            "type": "textarea"
          },
          {
            "id": "student-4",
            "label": "4.學生說明與師長關係：",
            "type": "textarea"
          },
          {
            "id": "student-5",
            "label": "5.學生說明學校生活及學習情形：",
            "type": "textarea"
          }
        ]
      },
      {
        "id": "other-notes",
        "title": "十五、其他",
        "description": "",
        "fields": [
          {
            "id": "other-notes-1",
            "label": "其他紀錄",
            "type": "textarea"
          }
        ]
      }
    ]
  },
  "autism": {
    "title": "115學年度版嘉義縣自閉症學生訪談紀錄表",
    "description": "115 學年度版。本表由鑑定評估人員填寫，視需求自行增減表格，受訪者須簽名。",
    "download": "downloads/autism.docx",
    "sections": [
      {
        "id": "basic",
        "title": "基本資料",
        "description": "115 學年度版。本表由鑑定評估人員填寫，視需求自行增減表格，受訪者須簽名。",
        "fields": [
          {
            "id": "school",
            "label": "學校",
            "type": "text"
          },
          {
            "id": "student",
            "label": "學生姓名",
            "type": "text"
          },
          {
            "id": "interviewer",
            "label": "晤談者（鑑定評估人員）",
            "type": "text"
          },
          {
            "id": "guardian-name",
            "label": "（一）受訪者（法定代理人或實際照顧者）",
            "type": "text"
          },
          {
            "id": "guardian-relationship",
            "label": "（一）受訪者（法定代理人或實際照顧者）－關係",
            "type": "text"
          },
          {
            "id": "guardian-time",
            "label": "（一）受訪者（法定代理人或實際照顧者）－晤談時間",
            "type": "text",
            "hint": "可填寫日期與時間。"
          },
          {
            "id": "teacher-name",
            "label": "（二）受訪者（班級導師）",
            "type": "text"
          },
          {
            "id": "teacher-relationship",
            "label": "（二）受訪者（班級導師）－關係",
            "type": "text"
          },
          {
            "id": "teacher-time",
            "label": "（二）受訪者（班級導師）－晤談時間",
            "type": "text",
            "hint": "可填寫日期與時間。"
          },
          {
            "id": "other-name",
            "label": "（三）受訪者（相關人員）",
            "type": "text"
          },
          {
            "id": "other-relationship",
            "label": "（三）受訪者（相關人員）－關係",
            "type": "text"
          },
          {
            "id": "other-time",
            "label": "（三）受訪者（相關人員）－晤談時間",
            "type": "text",
            "hint": "可填寫日期與時間。"
          }
        ]
      },
      {
        "id": "interview-1",
        "title": "一、就醫過程(新個案必填)",
        "description": "1.何時就醫？持續就醫時間？最近一次就醫時間&狀況？\n2.醫生是否建議用藥？劑量？用藥成效？如果尚未用藥，未用藥原因？藥物如何影響學生的行為?\n3.是否接受相關治療？治療頻率？持續時間？治療方式？成效如何？\n4.任何可能會影響學生行為問題的疾病或生理狀況(包括: 氣喘、過敏、癲癇、和生理期的問題…)",
        "fields": [
          {
            "id": "interview-1-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-1-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-1-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-2",
        "title": "二、早期療育過程(新個案必填)",
        "description": "接受早期療育之狀況？何時？接受何種項目？持續時間？頻率？效果如何？",
        "fields": [
          {
            "id": "interview-2-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-2-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-2-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-3",
        "title": "三、第一次發現孩子有異狀(新個案必填)",
        "description": "第一次發現孩子與其他孩子不一樣的時間？不一樣在哪些方面(語言發展遲緩、缺乏人際互動、行為問題、動作發展不佳、視聽覺異常等)？是誰發現的？當時採取什麼處理？主要照顧者是誰？",
        "fields": [
          {
            "id": "interview-3-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-3-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-3-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-4",
        "title": "四、孩子社會性互動方面─非口語行為",
        "description": "1.孩子與人目光接觸的狀況？是否會避開別人的眼睛，或有不當的視線接觸（如，直盯著人看）？\n2.與人身體接觸的接受程度如何？是否會避開接觸或有不當的接觸？\n3.情緒表情反應如何？是否曾有不適當的哭笑等情緒反應？說話時表情呆滯，少有變化？\n以上發生頻率、狀況、舉例說明。",
        "fields": [
          {
            "id": "interview-4-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-4-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-4-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-5",
        "title": "五、孩子社會性互動方面─同儕關係",
        "description": "孩子在同儕關係如何？在同儕團體中表現得過於主動、被動、或畏縮？是否適當？（如，有無不懂得和人相處，不瞭解規定，有不符合情境的互動行為）舉例說明。",
        "fields": [
          {
            "id": "interview-5-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-5-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-5-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-6",
        "title": "六、孩子社會性互動方面─主動分享",
        "description": "孩子的主動分享動機如何？會不會主動尋找他人分享喜悅、興趣，或活動的行為？舉例說明。",
        "fields": [
          {
            "id": "interview-6-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-6-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-6-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-7",
        "title": "七、孩子的溝通能力─語言交談與刻板語言",
        "description": "孩子語言交談狀況？無法主動開始對話？無法正確使用代名詞？與人聊天常變換話題或脫離主題？常發出別人聽不懂的語音，或聽得懂但無法辨識意義的語言？說重複的話 (如，仿說、一直說同樣的話) ？",
        "fields": [
          {
            "id": "interview-7-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-7-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-7-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-8",
        "title": "八、孩子的溝通能力─假扮性遊戲（學前或國小階段適用）",
        "description": "玩的時候不會模仿別人？玩的時候玩法沒有變化？不會玩假裝性或角色扮演的遊戲？舉例說明。",
        "fields": [
          {
            "id": "interview-8-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-8-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-8-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-9",
        "title": "九、孩子的行為、興趣與活動─特殊興趣？",
        "description": "盯著物體或環境中其他東西至少5秒鐘？喜歡看轉動或閃爍的東西？對感興趣的事物會不斷重複地說或做？過分沉迷地蒐集或操弄某些物品（如廣告紙、時刻表等）？身上攜帶某樣東西，不肯輕易離身？舉例說明。",
        "fields": [
          {
            "id": "interview-9-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-9-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-9-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-10",
        "title": "十、孩子的行為、興趣與活動─儀式行為？",
        "description": "日常生活習慣或常規改變時會生氣（如，用餐、放學時間；活動、座位等改變）？對事情的程序或步驟異常堅持？舉例說明。",
        "fields": [
          {
            "id": "interview-10-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-10-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-10-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-11",
        "title": "十一、家族病史",
        "description": "家族是否有其他身心障礙人士？障礙類別為何？與孩子的關係？",
        "fields": [
          {
            "id": "interview-11-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-11-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-11-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-12",
        "title": "十二、孩子曾經接受過之一般輔導措施？",
        "description": "接受過認輔制度或輔導老師的狀況？社會公益團體或民間協會的輔導？學校申請之醫療體系的治療(心理諮商師)？次數？輔導方式？輔導期間？成效如何？進步的地方？",
        "fields": [
          {
            "id": "interview-12-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-12-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-12-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "interview-13",
        "title": "十三、孩子目前接受特教服務情況",
        "description": "接受特教服務的狀況？孩子是否曾經入資源班？期間有多久？課程頻率？特教老師協助的方式？\n孩子接受特教服務後的情況？進步的地方？在普通班的影響？進入下一個教育階段，是否覺得有必要特教老師持續協助？為什麼？若是該項服務已終止，請說明當時終止的原因？",
        "fields": [
          {
            "id": "interview-13-guardian",
            "label": "家長",
            "type": "textarea"
          },
          {
            "id": "interview-13-teacher",
            "label": "導師",
            "type": "textarea"
          },
          {
            "id": "interview-13-related",
            "label": "相關人員",
            "type": "textarea",
            "optional": true
          }
        ]
      },
      {
        "id": "student-interview",
        "title": "十四、訪談學生",
        "description": "",
        "fields": [
          {
            "id": "student-1",
            "label": "1.學生自我介紹：",
            "type": "textarea"
          },
          {
            "id": "student-2",
            "label": "2.學生說明家庭成員及其關係：",
            "type": "textarea"
          },
          {
            "id": "student-3",
            "label": "3.學生說明與同儕關係：",
            "type": "textarea"
          },
          {
            "id": "student-4",
            "label": "4.學生說明與師長關係：",
            "type": "textarea"
          },
          {
            "id": "student-5",
            "label": "5.學生說明學校生活及學習情形：",
            "type": "textarea"
          }
        ]
      },
      {
        "id": "other-notes",
        "title": "十五、其他",
        "description": "",
        "fields": [
          {
            "id": "other-notes-1",
            "label": "其他紀錄",
            "type": "textarea"
          }
        ]
      }
    ]
  }
};
