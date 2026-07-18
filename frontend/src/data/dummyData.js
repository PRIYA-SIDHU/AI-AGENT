export const initialChats = [
  {
    id: "chat-1",
    title: "National Scholarship Portal (NSP) Guide",
    timestamp: "Today",
    isPinned: true,
    messages: [
      {
        id: "m1",
        sender: "user",
        text: "What is the criteria for post-matric scholarships on NSP?",
        timestamp: "10:30 AM"
      },
      {
        id: "m2",
        sender: "ai",
        text: `### NSP Post-Matric Scholarship Criteria (2026-27)

To be eligible for the Post-Matric Scholarship Scheme on the National Scholarship Portal, candidates must satisfy the following parameters:

1. **Academic Level**: Must be studying in Class 11, 12, Graduate, Postgraduate, Technical, or Vocational courses.
2. **Annual Family Income**: The total annual income of the parents/guardian from all sources must not exceed:
   - **₹2.5 Lakh** for SC/ST students.
   - **₹1.0 Lakh** for OBC students.
3. **Minimum Marks**: Must have secured at least **50% marks** in the previous final examination.
4. **Institutions**: The candidate must be studying in a recognized school, college, or university registered on the NSP.

#### Key Benefits Provided:
- Complete tuition fee reimbursement (subject to caps).
- Monthly maintenance allowance ranging from **₹380 to ₹1200** depending on the course group.

Would you like me to help you draft the document checklist or guide you through the registration process?`,
        timestamp: "10:31 AM"
      }
    ]
  },
  {
    id: "chat-2",
    title: "PM Kisan Samman Nidhi Status Check",
    timestamp: "Today",
    isPinned: false,
    messages: [
      {
        id: "m3",
        sender: "user",
        text: "How do I check if my 17th installment of PM Kisan is credited?",
        timestamp: "Yesterday"
      },
      {
        id: "m4",
        sender: "ai",
        text: `To check your **PM-KISAN 17th installment status**, you can follow these simple steps online:

### Step-by-Step Status Check:

1. Visit the official portal: [pmkisan.gov.in](https://pmkisan.gov.in).
2. Look for the **"Farmer's Corner"** section on the homepage.
3. Click on the **"Know Your Status"** option.
4. Enter your **Registration Number** (if you don't know it, click the *Know your registration number* link, which requires your Aadhaar or Mobile number).
5. Enter the Captcha code and click **"Get Data"**.

Your detailed installment history, bank account details, and verification status (e.g., e-KYC status, Land Seeding status) will be displayed.

> **Note:** If your **e-KYC** or **Land Seeding** shows "NO", your installment might be on hold. Let me know if you need instructions to complete your e-KYC.`,
        timestamp: "Yesterday"
      }
    ]
  },
  {
    id: "chat-3",
    title: "Startup India Seed Fund Eligibility",
    timestamp: "Yesterday",
    isPinned: true,
    messages: [
      {
        id: "m5",
        sender: "user",
        text: "Can a 6-month old startup apply for the Seed Fund Scheme?",
        timestamp: "Yesterday"
      },
      {
        id: "m6",
        sender: "ai",
        text: `Yes! A 6-month old startup is fully eligible to apply for the **Startup India Seed Fund Scheme (SISFS)**, provided it meets the other basic criteria.

Here is the eligibility criteria check for your startup:

### SISFS Startup Eligibility:
- **Registration Age**: The startup must be incorporated or registered **not more than 2 years ago** at the time of application. (Your 6-month old startup is well within this limit!)
- **DPIIT Recognition**: Must be recognized by the *Department for Promotion of Industry and Internal Trade (DPIIT)*. You can apply for this recognition online within a few days.
- **Business Model**: The startup must have a business idea or prototype with a viable commercialization potential, market fit, and scalability.
- **Technology Focus**: Should use technology or innovative solutions in its core product or service.
- **Funding Cap**: The startup should *not* have received more than **₹10 Lakh** of monetary support under any other Central or State Government scheme.

#### Available Funding Amounts:
- Up to **₹20 Lakh** as a grant for validation of proof of concept, prototype development, or trials.
- Up to **₹50 Lakh** of investment via debt-linked instruments or convertible debentures for market entry, commercialization, or scaling.`,
        timestamp: "Yesterday"
      }
    ]
  },
  {
    id: "chat-4",
    title: "Ayushman Bharat Card Apply Online",
    timestamp: "Last Week",
    isPinned: false,
    messages: [
      {
        id: "m7",
        sender: "user",
        text: "What document is needed for Ayushman Card?",
        timestamp: "Last Week"
      },
      {
        id: "m8",
        sender: "ai",
        text: `To apply for or download the **Ayushman Bharat PM-JAY Golden Card**, you primarily need to verify your eligibility via the Socio-Economic and Caste Census (SECC) database.

### Required Document List:
- **Aadhaar Card** (Mandatory for biometric/OTP verification)
- **Ration Card** or **Family ID Document** (To prove family composition)
- Active **Mobile Number** (To receive Aadhaar OTP)
- **PM Letter** or **Ration Card Copy** showing inclusion in the SECC-2011 beneficiary list.

Would you like to know how to check if your name is already in the beneficiary database?`,
        timestamp: "Last Week"
      }
    ]
  }
];

export const suggestionResponses = {
  scholarships: `### 🎓 Find Student Scholarships

Here are the top active Government Scholarships available right now. You can apply for these online through official portals:

#### 1. National Scholarship Portal (NSP) Schemes
- **Post-Matric Scholarship Scheme for SC/ST/OBC Students**:
  - *Eligibility*: Studying in class 11, 12, or higher (including degrees). Annual family income limit: ₹2.5 Lakh for SC/ST, ₹1 Lakh for OBC.
  - *Apply Portal*: [scholarships.gov.in](https://scholarships.gov.in)
- **Pragati Scholarship Scheme for Girl Students (Technical Degree)**:
  - *Eligibility*: Maximum of two girl children per family. Admitted to 1st year of Degree/Diploma course in AICTE approved institutions.
  - *Benefit*: ₹50,000 per annum.

#### 2. Central Sector Scheme of Scholarship (CSSS)
- **For College and University Students**:
  - *Eligibility*: Students above **80th percentile** in Class 12 board exams, studying regular courses. Family income < ₹4.5 Lakh per annum.
  - *Benefit*: ₹12,000/year for graduation; ₹20,000/year for post-graduation.

#### 3. AICTE Saksham Scholarship
- **For Specially-Abled Students**:
  - *Eligibility*: Specially-abled students with disability >= 40% pursuing technical education.
  - *Benefit*: ₹50,000 per annum.

---

**Next Steps**: Which category (School, Degree, Technical, or Minority) fits your profile? Let me know, and I can list exact documents you'll need!`,

  farming: `### 🌾 Farmer Welfare Schemes

The Indian Government offers several subsidy and income support schemes for farmers to reduce costs and boost productivity:

#### 1. PM Kisan Samman Nidhi (PM-KISAN)
- **Overview**: Income support scheme providing direct bank transfers to land-holding farmer families.
- **Benefit**: **₹6,000 per year** in three equal installments of ₹2,000.
- **Eligibility**: All landholding farmer families (subject to certain exclusion criteria like taxpayers, professional/retired officers).
- **Official Website**: [pmkisan.gov.in](https://pmkisan.gov.in)

#### 2. Pradhan Mantri Fasal Bima Yojana (PMFBY)
- **Overview**: Comprehensive crop insurance scheme protecting farmers against yield losses due to natural calamities, pests, or diseases.
- **Premium**: Low premium rates of only **1.5% to 2%** for food/oilseed crops, and **5%** for horticultural crops.
- **Website**: [pmfby.gov.in](https://pmfby.gov.in)

#### 3. PM Krishi Sinchayee Yojana (PMKSY) - Micro Irrigation
- **Overview**: Subsidies for installing drip and sprinkler irrigation systems.
- **Benefit**: Up to **55% subsidy** for small/marginal farmers, and **45%** for other farmers.

#### 4. PM Kisan Maan-Dhan Yojana (PM-KMY)
- **Overview**: Voluntary and contributory pension scheme for small and marginal farmers.
- **Benefit**: Minimum assured pension of **₹3,000 per month** after attaining the age of 60. Age eligibility: 18 to 40 years.

---

Let me know which scheme you want to apply for, and I can fetch the application eligibility or link!`,

  loans: `### 💼 Business & Startup Loans

Here are the primary credit and loan schemes offered by the government to support MSMEs, small business owners, and startups:

#### 1. Pradhan Mantri Mudra Yojana (PMMY)
Collateral-free loans for non-corporate, non-farm small/micro enterprises. Divided into three categories based on business growth stage:
- **Shishu**: Loans up to **₹50,000** (for startups/new small shops).
- **Kishor**: Loans from **₹50,000 to ₹5 Lakh** (for established businesses expanding).
- **Tarun**: Loans from **₹5 Lakh to ₹10 Lakh** (for larger capital requirements).

#### 2. CGTMSE (Credit Guarantee Fund Trust for Micro and Small Enterprises)
- **Overview**: Collateral-free credit facility up to **₹5 Crore** for MSMEs.
- **Guarantee**: The trust covers up to 75% to 85% of the loan amount, meaning you do not have to provide property as security.

#### 3. Stand-Up India Scheme
- **Target**: SC/ST and Women entrepreneurs.
- **Benefit**: Composite loans between **₹10 Lakh and ₹1 Crore** for setting up a greenfield (new) enterprise in manufacturing, services, or trading.

#### 4. Startup India Seed Fund Scheme (SISFS)
- **Benefit**: Up to **₹20 Lakh** grant for prototype/validation and **₹50 Lakh** investment via debt/convertible debentures for commercialization.

---

Are you looking to start a new business (Shishu Mudra / Seed Fund) or expand an existing one (Kishor/Tarun Mudra)? Tell me your sector, and I will share the bank application checklist.`,

  healthcare: `### 🏥 Healthcare Benefits & Insurance

The following schemes ensure free or highly subsidized medical treatment, diagnostics, and medicines:

#### 1. Ayushman Bharat - PM Jan Arogya Yojana (AB-PMJAY)
- **Benefit**: Completely cashless health insurance cover of **₹5 Lakh per family per year** for secondary and tertiary care hospitalization.
- **Hospital Network**: Over 27,000 empanelled public and private hospitals across India.
- **Premium**: 100% government-funded (no premium for beneficiaries).
- **Eligibility**: Based on SECC-2011 indicators (rural poor, occupational categories in urban areas).
- **Official Portal**: [beneficiary.nha.gov.in](https://beneficiary.nha.gov.in)

#### 2. PM Bhartiya Janaushadhi Pariyojana (PMBJP)
- **Overview**: Dedicated campaign to provide quality generic medicines at highly affordable prices through special Kendra stores.
- **Benefit**: Medicines are priced **50% to 90% cheaper** than branded equivalents.
- **Stores**: Over 10,000+ Janaushadhi Kendras operational across the country.

#### 3. PM Suraksha Bima Yojana (PMSBY)
- **Overview**: Extremely low-cost accidental death and disability insurance.
- **Premium**: Just **₹20 per year** (auto-debited from bank account).
- **Benefit**: **₹2 Lakh** in case of accidental death or permanent total disability.

---

If you'd like to check your eligibility for the **₹5 Lakh Ayushman Bharat Card** or locate the nearest generic medicine center, please let me know!`
};

export const getMockResponse = (userInput) => {
  const input = userInput.toLowerCase();
  
  if (input.includes("scholarship") || input.includes("student") || input.includes("education") || input.includes("nsp") || input.includes("matric")) {
    return {
      title: "Student Scholarships Info",
      text: suggestionResponses.scholarships
    };
  }
  if (input.includes("farm") || input.includes("kisan") || input.includes("agriculture") || input.includes("crop") || input.includes("welfare")) {
    return {
      title: "Farmer Welfare Schemes",
      text: suggestionResponses.farming
    };
  }
  if (input.includes("loan") || input.includes("business") || input.includes("startup") || input.includes("mudra") || input.includes("cgtmse") || input.includes("fund")) {
    return {
      title: "Business & Startup Loans",
      text: suggestionResponses.loans
    };
  }
  if (input.includes("health") || input.includes("ayushman") || input.includes("medical") || input.includes("hospital") || input.includes("insurance") || input.includes("medicine")) {
    return {
      title: "Healthcare Benefits",
      text: suggestionResponses.healthcare
    };
  }

  // General responsive answers
  return {
    title: "GovAssist Support",
    text: `### 🤖 GovAssist AI Support

I heard your query: *"#USER_INPUT#"*. 

I can assist you with information regarding:
1. **Student Scholarships** (NSP, Post-Matric, AICTE schemes)
2. **Farmer Support** (PM-Kisan, Crop Insurance, Irrigation subsidies)
3. **Business Credit** (Mudra Loans, Startup Seed Funds, CGTMSE)
4. **Healthcare Plans** (Ayushman Cards, Generic Medicine Centers)

#### General Guidance:
- For official schemes, always ensure you apply via **official \`.gov.in\` or \`.nic.in\` websites** to avoid scams.
- Keep documents like your **Aadhaar Card**, **Income Certificate**, **Ration Card**, and **Academic Certificates** handy.

Could you please specify which exact scheme or category you are inquiring about? I'll fetch the detailed guidelines for you immediately!`
      .replace("#USER_INPUT#", userInput)
  };
};
