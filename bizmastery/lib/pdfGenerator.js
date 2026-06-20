const PDFDocument = require('pdfkit');

function generateBusinessMasteryPDF(res) {
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: 60, bottom: 60, left: 72, right: 72 },
    info: {
      Title: 'Business Zero to Mastery — Complete Guide',
      Author: 'BizMastery',
      Subject: 'Start, Build & Scale Any Business in Any U.S. State'
    }
  });

  // ── Colors & Fonts ──────────────────────────────────────────────────────
  const NAVY   = '#0a1628';
  const GOLD   = '#c9a227';
  const GRAY   = '#6b6860';
  const WHITE  = '#ffffff';
  const TEAL   = '#0e7c6b';

  // ── Helper functions ────────────────────────────────────────────────────
  function addPage() {
    doc.addPage();
  }

  function heading1(text) {
    doc.fontSize(28).fillColor(NAVY).font('Helvetica-Bold').text(text, { align: 'left' });
    doc.moveDown(0.3);
    doc.rect(doc.x, doc.y, 60, 3).fill(GOLD);
    doc.moveDown(1);
  }

  function heading2(text) {
    doc.fontSize(16).fillColor(NAVY).font('Helvetica-Bold').text(text);
    doc.moveDown(0.5);
  }

  function heading3(text) {
    doc.fontSize(13).fillColor(TEAL).font('Helvetica-Bold').text(text);
    doc.moveDown(0.3);
  }

  function body(text) {
    doc.fontSize(10).fillColor('#333333').font('Helvetica').text(text, { lineGap: 4 });
    doc.moveDown(0.5);
  }

  function bullet(text) {
    doc.fontSize(10).fillColor('#333333').font('Helvetica')
       .text(`• ${text}`, { indent: 16, lineGap: 3 });
  }

  function tip(text) {
    const y = doc.y;
    doc.rect(72, y, 3, 40).fill(GOLD);
    doc.fontSize(9).fillColor(GRAY).font('Helvetica-Oblique')
       .text(`💡 ${text}`, 82, y, { width: 430, lineGap: 3 });
    doc.moveDown(1);
  }

  function sectionDivider() {
    doc.moveDown(0.5);
    doc.rect(72, doc.y, 468, 1).fill('#e8e6e0');
    doc.moveDown(1);
  }

  function coverPage() {
    // Background
    doc.rect(0, 0, 612, 792).fill(NAVY);

    // Gold accent bar
    doc.rect(0, 0, 8, 792).fill(GOLD);

    // Title
    doc.fontSize(42).fillColor(GOLD).font('Helvetica-Bold')
       .text('BizMastery', 60, 160, { align: 'left' });

    doc.fontSize(22).fillColor(WHITE).font('Helvetica')
       .text('Business Zero to Mastery', 60, 220);

    doc.fontSize(14).fillColor(GOLD).font('Helvetica')
       .text('The Complete U.S. Business Launch Guide', 60, 255);

    // Divider
    doc.rect(60, 290, 200, 2).fill(GOLD);

    // Subtitle content
    doc.fontSize(11).fillColor('#b5b2a8').font('Helvetica')
       .text('✦  All 50 States — Fees, Taxes & Requirements', 60, 320)
       .text('✦  10-Phase Business Formation Roadmap', 60, 345)
       .text('✦  Government Contracting Playbook', 60, 370)
       .text('✦  Business Credit Blueprint (Tiers 1–4)', 60, 395)
       .text('✦  100+ Business Type Profiles', 60, 420)
       .text('✦  Maryland-Specific Complete Guide', 60, 445);

    // Bottom
    doc.fontSize(9).fillColor('#6b6860')
       .text('bizmastery.com  ·  For informational purposes only. Consult a licensed attorney or CPA.', 60, 740, { align: 'center', width: 500 });
  }

  function tableOfContents() {
    addPage();
    heading1('Table of Contents');

    const sections = [
      ['Phase 1', 'Legal Foundation & Entity Formation', '3'],
      ['Phase 2', 'Financial Infrastructure', '4'],
      ['Phase 3', 'Branding & Business Presence', '5'],
      ['Phase 4', 'Compliance & Insurance', '6'],
      ['Phase 5', 'Government Contract Registration', '7'],
      ['Phase 6', 'Certifications for Competitive Advantage', '8'],
      ['Phase 7', 'Business Credit Building — Tiers 1–4', '9'],
      ['Phase 8', 'Finding & Winning Government Contracts', '11'],
      ['Phase 9', 'Scale & Protect', '12'],
      ['Phase 10', 'Long-Term Growth', '13'],
      ['All 50 States', 'State-by-State Business Requirements', '14'],
      ['100+ Business Types', 'Complete Business Type Profiles', '20'],
      ['Certifications', 'Government Certifications Guide', '28'],
      ['Resources', 'Key Links, Contacts & Tools', '30'],
    ];

    sections.forEach(([num, title, page]) => {
      const y = doc.y;
      doc.fontSize(11).fillColor(TEAL).font('Helvetica-Bold').text(num, 72, y, { width: 80, continued: false });
      doc.fontSize(11).fillColor(NAVY).font('Helvetica').text(title, 155, y, { width: 340 });
      doc.fontSize(11).fillColor(GRAY).text(page, 500, y, { width: 40, align: 'right' });
      doc.moveDown(0.7);
    });
  }

  // ── COVER ────────────────────────────────────────────────────────────────
  coverPage();

  // ── TABLE OF CONTENTS ────────────────────────────────────────────────────
  tableOfContents();

  // ── PHASE 1 ──────────────────────────────────────────────────────────────
  addPage();
  heading1('Phase 1 — Legal Foundation');

  heading2('Step 1: Obtain Your EIN (Employer Identification Number)');
  body('Apply at IRS.gov/EIN — free and takes 5 minutes online. This is your business\'s Social Security Number. Required before opening a bank account, hiring employees, or filing taxes.');
  bullet('Go to IRS.gov and search "EIN Online Application"');
  bullet('Select your entity type (LLC, Corporation, Partnership, etc.)');
  bullet('Complete the online form — takes about 5 minutes');
  bullet('Download and SAVE your CP575 confirmation letter — banks require the original');
  tip('Maryland tip: After your LLC is approved by SDAT, immediately go to IRS.gov to get your EIN. Select "Limited Liability Company" and input Maryland as your state.');
  doc.moveDown(0.5);

  heading2('Step 2: Open a Dedicated Business Bank Account');
  body('Never mix personal and business money. Use your EIN (not SSN), LLC articles, and operating agreement to open the account. This protects your liability shield and is required for government contracts.');
  bullet('Chase Business Complete Banking ($15/mo, waived with $2k balance)');
  bullet('Bank of America Business Advantage Checking');
  bullet('BlueVine Business Checking (free, online, no fees)');
  bullet('Local credit union business accounts often have lowest fees');
  tip('Bring to the bank: EIN confirmation letter, LLC articles of organization, government ID, operating agreement, and $100+ for initial deposit.');
  doc.moveDown(0.5);

  heading2('Step 3: Registered Agent');
  body('Maryland requires a registered agent with a physical MD address. Can be yourself, a member, or a service. Registered agents receive legal documents and state notices.');
  bullet('Northwest Registered Agent — $125/year (recommended for privacy)');
  bullet('ZenBusiness — $99/year');
  bullet('Registered Agents Inc — $100/year');
  tip('If you list yourself as registered agent, your home address becomes public record in Maryland. Use a service for privacy.');

  sectionDivider();

  heading2('Step 4: Operating Agreement');
  body('Even for single-member LLCs, this is critical. It documents ownership, profit sharing, decision-making, and member roles. Banks and government agencies often require it.');
  bullet('Documents ownership percentages');
  bullet('Describes how profits and losses are allocated');
  bullet('Outlines dissolution procedures');
  bullet('Includes banking authorization clause');
  tip('Single-member Maryland LLC: Your operating agreement is what lets you open accounts and sign contracts. Keep it updated whenever anything changes.');

  heading2('Step 5: Maryland Business License');
  body('Maryland requires specific licenses by county and industry. General trading licenses cost $15–$150. Food, construction, childcare, and professional services have separate state licenses.');
  bullet('Check: onestop.md.gov (Maryland OneStop portal)');
  bullet('Shows every license needed by business type and county');
  bullet('County business license from your county clerk\'s office');
  bullet('Professional state licenses from Maryland DLLR: dllr.maryland.gov');

  // ── PHASE 2 ──────────────────────────────────────────────────────────────
  addPage();
  heading1('Phase 2 — Financial Infrastructure');

  heading2('Step 1: Business Accounting Software');
  body('Start tracking immediately. Set up these expense categories from day one:');
  bullet('Wave Accounting — FREE, excellent for startups');
  bullet('QuickBooks Simple Start — $30/month, most popular');
  bullet('FreshBooks — $17/month, great for service businesses');
  tip('Key categories to set up: Office supplies, Travel, Marketing, Professional fees, Equipment, Home office (if applicable), Meals (50% deductible). Keep receipts for ALL purchases over $25.');
  doc.moveDown(0.5);

  heading2('Step 2: Business Credit Card');
  body('Apply using your EIN. Start with a secured business card if you have no business credit history. This begins building your business credit profile.');
  bullet('Capital One Spark Cash Select — no annual fee, 1.5% cash back');
  bullet('Wells Fargo Business Secured — for building credit from zero');
  bullet('Brex — no personal guarantee required');
  tip('Use your business card ONLY for business purchases and pay in full monthly. Your business credit score begins building within 90 days.');
  doc.moveDown(0.5);

  heading2('Step 3: DUNS / UEI Number');
  body('The Unique Entity Identifier replaced DUNS in 2022. You get it automatically when registering at SAM.gov. Required for ALL federal contracts.');
  bullet('Go to SAM.gov and click "Register Entity"');
  bullet('Have ready: EIN, NAICS codes, banking info for electronic payments');
  bullet('Registration takes 7–10 business days to activate');
  tip('Do this NOW — before you need it. Many new businesses lose contracting opportunities because they didn\'t register SAM.gov in advance.');

  heading2('Maryland Tax Obligations');
  body('Maryland has multiple tax requirements. Register for all that apply:');
  bullet('State income tax: 2–5.75% (brackets)');
  bullet('County income tax: 2.25–3.2% (varies by county)');
  bullet('Sales & use tax: 6% — register at marylandtaxes.gov');
  bullet('Personal property tax on business assets — Form 1, due April 15');
  bullet('Annual LLC report: $300, due April 15 — Maryland SDAT');
  tip('Set calendar reminders for March 1 each year to prepare both the $300 annual report and the personal property return (Form 1). Missing these blocks you from government contracts.');

  // ── ALL 50 STATES ────────────────────────────────────────────────────────
  addPage();
  heading1('All 50 States — Business Requirements');

  const states = [
    ['Alabama','$236','$100','Apr 15','6.5%','4%','Must publish formation notice in newspaper. Privilege tax based on net worth.'],
    ['Alaska','$250','$100','Jan 2','0%','0%','No income or sales tax. Biennial report every 2 years. Most tax-friendly state.'],
    ['Arizona','$50','$0','None','4.9%','5.6%','No annual report fee. Low formation cost. Transaction Privilege Tax applies.'],
    ['Arkansas','$45','$150','May 1','5.3%','6.5%','Annual franchise tax report required.'],
    ['California','$70','$800','15th/4th mo','8.84%','7.25%','$800 minimum franchise tax annually. One of the most expensive states.'],
    ['Colorado','$50','$10','Annually','4.4%','2.9%','Very low annual fee. Business-friendly overall.'],
    ['Connecticut','$120','$80','Mar 31','7.5%','6.35%','Annual report required. Strong finance and insurance economy.'],
    ['Delaware','$90','$300','Jun 1','8.7%','0%','Most popular for incorporation. No sales tax. Best for seeking investors.'],
    ['Florida','$125','$138.75','May 1','5.5%','6%','No personal income tax. $400 late fee if annual report missed.'],
    ['Georgia','$100','$50','Apr 1','5.75%','4%','Low annual fee. No separate LLC tax if pass-through.'],
    ['Hawaii','$50','$15','Varies','6.4%','4%','General Excise Tax (GET) applies to ALL business receipts at 4%.'],
    ['Idaho','$100','$0','None','5.8%','6%','No annual report fee after formation. Very business-friendly.'],
    ['Illinois','$150','$75','Varies','9.5%','6.25%','High corporate tax. Personal Property Replacement Tax of 1.5% for LLCs.'],
    ['Indiana','$95','$32','Annually','4.9%','7%','Low flat corporate tax rate. Biennial report every 2 years.'],
    ['Iowa','$50','$60','Apr 1','8.4%','6%','Biennial report required. Decreasing corporate tax rate schedule.'],
    ['Kansas','$160','$55','Varies','4%','6.5%','Annual report required. Small business tax incentives available.'],
    ['Kentucky','$40','$15','Jun 30','5%','6%','Very low fees. One of most affordable states to maintain an LLC.'],
    ['Louisiana','$100','$35','Varies','7.5%','4.45%','Parish-level taxes and licenses also required.'],
    ['Maine','$175','$85','Jun 1','8.93%','5.5%','Annual report required. High income tax rates.'],
    ['Maryland','$100','$300','Apr 15','8.25%','6%','Annual report $300 + personal property return. Excellent for gov contracting.'],
    ['Massachusetts','$500','$500','Annually','8%','6.25%','Highest LLC fees in the nation. Strong innovation economy.'],
    ['Michigan','$50','$25','Feb 15','6%','6%','Low annual fee. Flat corporate income tax.'],
    ['Minnesota','$155','$0','Dec 31','9.8%','6.875%','Annual renewal is free. High income tax but strong economy.'],
    ['Mississippi','$50','$0','Apr 15','5%','7%','Annual report is free. Very low cost of business.'],
    ['Missouri','$105','$0','None','4%','4.225%','No annual report for LLCs. One of easiest states for LLC maintenance.'],
    ['Montana','$35','$15','Apr 15','6.75%','0%','No sales tax. Great for holding real estate or assets.'],
    ['Nebraska','$100','$13','Apr 1','7.25%','5.5%','Biennial occupation tax. Very low annual fee.'],
    ['Nevada','$75','$200','Varies','0%','6.85%','No income tax. Strong privacy protections. Second most popular after Delaware.'],
    ['New Hampshire','$100','$100','Apr 1','7.5%','0%','No sales or wage income tax. Business Profits Tax applies.'],
    ['New Jersey','$125','$75','Annually','9%','6.625%','High taxes but access to huge NY/NJ market.'],
    ['New Mexico','$50','$0','None','5.9%','5%','No annual report for LLCs. Very low maintenance cost.'],
    ['New York','$200','$9','Biennial','6.5%','4%','PUBLICATION REQUIREMENT: Must publish in 2 newspapers for 6 weeks ($1,000-$2,000).'],
    ['North Carolina','$125','$200','Apr 15','2.5%','4.75%','Lowest and decreasing corporate tax. Strong economic growth.'],
    ['North Dakota','$135','$50','Nov 15','4.31%','5%','Annual report required. Low population but favorable tax environment.'],
    ['Ohio','$99','$0','None','0%','5.75%','No corporate income tax. Commercial Activity Tax on gross receipts.'],
    ['Oklahoma','$104','$25','Varies','4%','4.5%','Annual certificate of compliance required. Low overall taxes.'],
    ['Oregon','$100','$100','Varies','6.6%','0%','No sales tax. Corporate Activity Tax for businesses over $1M receipts.'],
    ['Pennsylvania','$125','$7','10-yr Report','9.99%','6%','Highest corporate tax. Decennial report every 10 years.'],
    ['Rhode Island','$150','$50','Nov 1','7%','7%','Annual report required. Small state with high rates.'],
    ['South Carolina','$110','$0','None','5%','6%','No annual report for LLCs. License Tax based on paid-in capital.'],
    ['South Dakota','$150','$50','Varies','0%','4.5%','No income tax. Strong privacy laws. Very business-friendly.'],
    ['Tennessee','$300','$300','Apr 1','6.5%','7%','High fees but no income tax on wages. Franchise & Excise Tax applies.'],
    ['Texas','$300','$0','May 15','0%','6.25%','No personal income tax. Franchise Tax on receipts over $1.23M. Strong economy.'],
    ['Utah','$70','$18','Varies','4.85%','4.85%','Very low annual fee. Low flat tax rate. Business-friendly.'],
    ['Vermont','$125','$35','Mar 15','8.5%','6%','Annual report required. High personal income tax.'],
    ['Virginia','$100','$50','Varies','6%','4.3%','Strong federal contracting market (DC/Pentagon proximity). No LLC franchise tax.'],
    ['Washington','$180','$60','Varies','0%','6.5%','No income tax. Business & Occupation Tax on gross receipts.'],
    ['West Virginia','$100','$25','Jun 30','6.5%','6%','Annual report required. Low annual fee.'],
    ['Wisconsin','$130','$25','Quarterly','7.9%','5%','Annual report can be filed quarterly. Manufacturing & Agriculture credit available.'],
    ['Wyoming','$100','$52','Varies','0%','4%','No income tax. Strongest privacy protections. Top choice for asset protection.'],
  ];

  // Table header
  const colWidths = [120, 55, 55, 60, 45, 45, 182];
  const headers = ['State', 'LLC Fee', 'Annual', 'Due', 'Corp Tax', 'Sales Tax', 'Key Notes'];
  let x = 72;
  doc.fontSize(8).font('Helvetica-Bold').fillColor(WHITE);
  doc.rect(72, doc.y, 468, 16).fill(NAVY);
  const headerY = doc.y + 4;
  headers.forEach((h, i) => {
    doc.text(h, x + 2, headerY, { width: colWidths[i] - 4 });
    x += colWidths[i];
  });
  doc.moveDown(0.1);

  states.forEach((row, idx) => {
    if (doc.y > 680) { addPage(); }
    const rowY = doc.y + 3;
    if (idx % 2 === 0) {
      doc.rect(72, doc.y, 468, 20).fill('#f8f7f4');
    }
    x = 72;
    doc.fontSize(7.5).font('Helvetica').fillColor(NAVY);
    row.forEach((cell, i) => {
      if (i === 0) doc.font('Helvetica-Bold').fillColor(TEAL);
      else doc.font('Helvetica').fillColor('#333333');
      doc.text(cell, x + 2, rowY, { width: colWidths[i] - 4, lineBreak: false });
      x += colWidths[i];
    });
    doc.y = rowY + 16;
  });

  // ── GOVERNMENT CONTRACTING ───────────────────────────────────────────────
  addPage();
  heading1('Government Contracting Playbook');

  body('The U.S. federal government spends over $650 billion annually on contracts. State and local governments add hundreds of billions more. Here is your complete roadmap.');

  heading2('Step 1: Register on SAM.gov');
  body('System for Award Management — the official federal vendor database. Free. Required for ALL federal contracts.');
  bullet('Go to SAM.gov and create a login.gov account first');
  bullet('Click "Register Entity" and complete all sections');
  bullet('Have ready: EIN, NAICS codes, banking info');
  bullet('Your CAGE code is assigned automatically upon approval');
  bullet('Takes 7–10 business days — do this immediately after formation');
  tip('Your SAM.gov registration must be renewed every 365 days or you lose eligibility for all federal contracts. Set a calendar reminder.');
  doc.moveDown(0.5);

  heading2('Step 2: Choose Your NAICS Codes');
  body('North American Industry Classification System codes define what your business does. Examples:');
  bullet('IT Services: 541512');
  bullet('Management Consulting: 541611');
  bullet('Janitorial/Cleaning: 561720');
  bullet('Construction: 236220');
  bullet('Staffing/Temp Agencies: 561330');
  bullet('Security Services: 561612');
  bullet('Transportation/Trucking: 484110');
  bullet('Healthcare Staffing: 621399');
  doc.moveDown(0.5);

  heading2('Government Certifications');
  const certs = [
    ['SBA 8(a)', 'certify.SBA.gov', '90-120 days', 'Free', 'For socially/economically disadvantaged business owners. Sole-source awards up to $4M.'],
    ['HUBZone', 'certify.SBA.gov', '60-90 days', 'Free', '35% of employees in HUBZone + principal office in HUBZone. 10% price preference.'],
    ['WOSB', 'certify.SBA.gov', '30-60 days', 'Free', '51%+ owned by woman U.S. citizen. Set-asides in underrepresented industries.'],
    ['SDVOSB', 'certify.SBA.gov', '30-60 days', 'Free', 'Service-disabled veteran ownership. VA mandates 3% of spending to SDVOSBs.'],
    ['Maryland MBE', 'mdot.maryland.gov', '45-90 days', 'Free', 'Maryland minority/women set-aside contracts. Required by many prime contractors.'],
    ['DBE', 'mdot.maryland.gov', '45-90 days', 'Free', 'Federally-funded transportation projects — roads, bridges, airports, transit.'],
  ];

  certs.forEach(([name, where, time, cost, desc]) => {
    heading3(name);
    doc.fontSize(9).fillColor('#333333').font('Helvetica')
       .text(`Where: ${where}  |  Timeline: ${time}  |  Cost: ${cost}`);
    doc.moveDown(0.3);
    body(desc);
  });

  // ── BUSINESS CREDIT ──────────────────────────────────────────────────────
  addPage();
  heading1('Business Credit Blueprint — Tiers 1–4');

  body('Build business credit completely separate from your personal credit. Use your EIN (not SSN) for all applications. Never mix personal and business finances.');

  heading2('Tier 1 — Foundation (Months 0–3)');
  body('Start with net-30 vendors that report to Dun & Bradstreet and Experian Business:');
  bullet('Uline.com — shipping supplies, net-30 terms (reports to D&B)');
  bullet('Quill.com — office supplies, net-30 (reports to D&B and Experian)');
  bullet('Grainger.com — industrial supplies, net-30 (reports to Experian)');
  bullet('Summa Office Supplies — net-30 (easy approval)');
  bullet('Crown Office Supplies — net-30 (easy approval)');
  tip('Pay all invoices 5–10 days EARLY. Early payment boosts your Paydex score faster than paying on time. Goal: Paydex score of 80+ within 90 days.');
  doc.moveDown(0.5);

  heading2('Tier 2 — Retail Credit (Months 3–6)');
  bullet('Home Depot Pro Business Account (EIN only, no personal guarantee)');
  bullet('Lowes Business Credit Account');
  bullet('Staples Business Credit');
  bullet('Office Depot Business Credit');
  bullet('Amazon Business Line of Credit');
  bullet('Best Buy Business Credit');
  tip('Keep utilization below 30% on all accounts. Apply for one account at a time, 2-3 weeks apart, to avoid too many inquiries.');
  doc.moveDown(0.5);

  heading2('Tier 3 — Fleet & Gas Cards (Months 6–9)');
  bullet('WEX Fleet Card — strong D&B reporter, high limits');
  bullet('Shell Fleet Card — reports to business bureaus');
  bullet('Fuelman — fleet management with reporting');
  bullet('BP Business Solutions');
  bullet('Chevron Texaco Business Card');
  tip('Fleet cards often approve based on business credit alone (not personal). If your business uses vehicles for anything — client visits, deliveries, materials — get a fleet card now.');
  doc.moveDown(0.5);

  heading2('Tier 4 — Bank Lines & SBA Loans (Months 12–18)');
  bullet('Business line of credit at your own bank ($10k–$50k)');
  bullet('Chase Ink Business Cash — $0 annual fee, 5% cash back on office expenses');
  bullet('Capital One Spark — $0 annual fee, 1.5% cash back');
  bullet('SBA Microloan — up to $50,000, lower interest rates');
  bullet('SBA 7(a) Loan — up to $5 million for established businesses');
  bullet('Fundbox or BlueVine — online revolving credit lines');
  tip('The key to Tier 4 approval is 2+ years of business banking history with consistent deposits. Keep your business account active and growing month over month.');

  // ── 100+ BUSINESS TYPES ──────────────────────────────────────────────────
  addPage();
  heading1('100+ Business Type Profiles');

  const bizTypes = [
    ['LLC / Consulting Firm','Professional Services','$500–$3k','$50k–$300k/yr','Low','Offer expertise-based services. Register LLC, get EIN, open bank account, build client base.'],
    ['Digital Marketing Agency','Marketing','$1k–$5k','$80k–$500k/yr','Medium','SEO, social media, paid ads. Get certified on Google/Meta platforms.'],
    ['Government Contracting','Government','$2k–$10k','$100k–$10M+','High','Register SAM.gov, get certifications, build past performance portfolio.'],
    ['Real Estate Investment','Real Estate','$10k–$100k+','$30k–$1M+/yr','Medium','Buy, rent, or flip properties. Need capital, real estate knowledge, and patience.'],
    ['E-commerce Store','Retail','$500–$5k','$20k–$500k/yr','Medium','Shopify or WooCommerce. Source products, build store, run paid ads.'],
    ['Amazon FBA','Retail','$2k–$10k','$30k–$300k/yr','Medium','Source products, ship to Amazon warehouse, Amazon handles fulfillment.'],
    ['Cleaning Company','Home Services','$1k–$5k','$40k–$200k/yr','Low','Residential or commercial. Recurring revenue. Low startup cost.'],
    ['Landscaping / Lawn Care','Home Services','$2k–$15k','$40k–$250k/yr','Low','Equipment needed. Recurring contracts. Snow removal in winter.'],
    ['Food Truck','Food & Bev','$30k–$100k','$50k–$200k/yr','Medium','Health permit, commissary kitchen, mobile vendor permit required.'],
    ['Catering Business','Food & Bev','$5k–$25k','$40k–$200k/yr','Medium','Food handler license, commercial kitchen, liability insurance.'],
    ['Personal Training','Health','$1k–$5k','$40k–$150k/yr','Low','NASM/ACE certification. In-person or online clients.'],
    ['Home Health Care','Healthcare','$10k–$40k','$100k–$1M+','High','State license required. Can bill Medicare/Medicaid with proper licensing.'],
    ['Staffing Agency','Professional','$5k–$20k','$100k–$5M','Medium','Connect businesses with workers. Collect 15-30% of placed worker salary.'],
    ['IT Support / MSP','Technology','$2k–$10k','$80k–$500k/yr','Medium','Managed services for businesses. Recurring monthly contracts.'],
    ['Software Development','Technology','$1k–$10k','$80k–$500k+/yr','High','Custom software, apps, or SaaS products.'],
    ['YouTube Automation','Media','$500–$3k','$10k–$100k+/yr','Medium','Faceless channels via automation. n8n, Claude AI, ElevenLabs, Creatomate.'],
    ['Social Media Management','Marketing','$500–$2k','$30k–$150k/yr','Low','Manage accounts and create content for businesses on retainer.'],
    ['Trucking / Freight','Transportation','$15k–$150k','$60k–$300k/yr','Medium','CDL license, FMCSA registration, DOT number, liability insurance.'],
    ['Construction Company','Construction','$10k–$50k','$100k–$2M+','High','Contractor license, bonding, insurance, workers comp required.'],
    ['Plumbing Business','Construction','$10k–$30k','$60k–$200k/yr','Medium','State plumber license, bond, insurance. High demand service.'],
    ['Electrical Contractor','Construction','$10k–$40k','$80k–$300k/yr','High','Electrician license required by state. Apprenticeship path available.'],
    ['HVAC Business','Construction','$10k–$50k','$80k–$300k/yr','High','EPA 608 certification required for refrigerant handling.'],
    ['Roofing Company','Construction','$10k–$40k','$80k–$500k/yr','Medium','Contractor license, insurance, high demand after storms.'],
    ['Photography','Creative','$2k–$10k','$30k–$150k/yr','Low','Camera equipment, editing software, portfolio website.'],
    ['Videography','Creative','$3k–$15k','$40k–$200k/yr','Medium','Video equipment, editing suite, client portfolio.'],
    ['Graphic Design Agency','Creative','$500–$3k','$30k–$200k/yr','Low','Design software (Adobe CC), portfolio, client outreach.'],
    ['Event Planning','Events','$2k–$8k','$40k–$200k/yr','Medium','Vendor relationships, insurance, event planning certification helpful.'],
    ['Security Guard Company','Security','$5k–$25k','$80k–$500k/yr','High','State guard agency license, armed/unarmed licenses for guards.'],
    ['Janitorial Services','Home Services','$2k–$10k','$50k–$300k/yr','Low','Excellent for gov contracts. Recurring revenue. Bonding required.'],
    ['Bookkeeping','Financial','$500–$2k','$50k–$200k/yr','Low','QuickBooks certification. Serve small businesses on monthly retainer.'],
    ['Insurance Agency','Financial','$2k–$10k','$40k–$300k/yr','High','State insurance producer license required for each line of insurance.'],
    ['Tax Preparation','Financial','$2k–$8k','$30k–$150k/yr','Low','PTIN from IRS, seasonal business with year-round clients possible.'],
    ['Real Estate Agent','Real Estate','$2k–$8k','$50k–$500k/yr','Medium','State real estate license, join NAR, hang license with broker.'],
    ['Property Management','Real Estate','$3k–$15k','$50k–$300k/yr','Medium','Property manager license in most states. Manage rentals for owners.'],
    ['Virtual Assistant','Professional','$200–$1k','$20k–$80k/yr','Low','Remote admin support. Platforms: Upwork, Fiverr, direct outreach.'],
    ['Online Course','Education','$500–$3k','$20k–$500k/yr','Medium','Record and sell courses on Teachable, Kajabi, or your own platform.'],
    ['Childcare / Daycare','Education','$10k–$50k','$40k–$200k/yr','High','State childcare license, background checks, fire safety inspections.'],
    ['Hair Salon','Beauty','$20k–$75k','$50k–$300k/yr','Medium','Cosmetology license, salon lease or booth rental.'],
    ['Auto Detailing','Automotive','$2k–$15k','$30k–$150k/yr','Low','Mobile or shop-based. High repeat customer rate.'],
    ['Auto Repair Shop','Automotive','$30k–$150k','$80k–$400k/yr','High','ASE certifications, equipment, EPA compliance for waste disposal.'],
    ['Pest Control','Home Services','$10k–$40k','$60k–$300k/yr','Medium','State pesticide applicator license required. Recurring contracts.'],
    ['Vending Machine Business','Passive','$5k–$30k','$10k–$100k/yr','Low','Place machines in offices, gyms, schools. Passive income.'],
    ['ATM Business','Passive','$3k–$15k','$10k–$80k/yr','Low','Place ATMs in businesses. Earn $1-4 per transaction.'],
    ['Dropshipping','Retail','$500–$2k','$10k–$100k/yr','Medium','No inventory. Sell online, supplier ships direct.'],
    ['Airbnb / Short-Term Rental','Real Estate','$5k–$50k','$20k–$200k/yr','Medium','Check local STR regulations. Some cities restrict Airbnb.'],
    ['Cybersecurity Company','Technology','$5k–$20k','$100k–$1M+/yr','High','CISSP/CompTIA certs. High demand from gov and enterprise.'],
    ['AI Consulting','Technology','$1k–$5k','$100k–$500k/yr','High','Help businesses implement AI automation. Fastest growing field.'],
    ['Freight Brokerage','Transportation','$5k–$20k','$60k–$400k/yr','Medium','FMCSA broker authority license, $75k surety bond required.'],
    ['Drone Services','Technology','$3k–$15k','$40k–$200k/yr','Medium','FAA Part 107 certification required. Commercial drone pilot.'],
    ['Solar Installation','Energy','$30k–$100k','$100k–$1M/yr','High','State contractor license, NABCEP certification, utility interconnection.'],
    ['Healthcare Staffing','Healthcare','$10k–$40k','$200k–$5M/yr','High','Background checks, nurse/CNA license verification, insurance.'],
    ['Pressure Washing','Home Services','$3k–$15k','$40k–$150k/yr','Low','Mobile service. Low startup cost. Good for gov facility contracts.'],
    ['Medical Billing','Healthcare','$1k–$5k','$40k–$200k/yr','Medium','Work from home. AAPC/AHIMA certification helpful.'],
    ['SaaS Product','Technology','$10k–$100k','$50k–$10M+/yr','Very High','Recurring subscription revenue. Highest potential but complex.'],
    ['Ghost Kitchen','Food & Bev','$10k–$40k','$40k–$200k/yr','Medium','Delivery-only. Rent commercial kitchen space. Uber Eats/DoorDash.'],
    ['Franchise','Business Models','$50k–$1M+','$50k–$500k/yr','High','Buy proven system. Franchise disclosure document review critical.'],
    ['Nonprofit 501(c)(3)','Nonprofit','$1k–$5k','Varies','Medium','File Form 1023 with IRS. State charitable registration also required.'],
    ['Import/Export','International','$10k–$50k','$50k–$500k/yr','High','CBP importer number, AES filing for exports, trade compliance.'],
    ['Print on Demand','Creative','$200–$1k','$5k–$50k/yr','Low','Design products, Printful/Printify fulfills. No inventory needed.'],
    ['Medical Spa','Beauty','$50k–$250k','$200k–$2M/yr','Very High','Physician/NP supervision required. High revenue potential.'],
  ];

  // Business types table
  const bizColWidths = [150, 80, 70, 80, 50, 185];
  const bizHeaders = ['Business Type', 'Category', 'Startup Cost', 'Income/Yr', 'Difficulty', 'Key Requirement'];
  x = 72;
  doc.fontSize(7.5).font('Helvetica-Bold').fillColor(WHITE);
  doc.rect(72, doc.y, 615, 16).fill(NAVY);
  const bizHeaderY = doc.y + 4;
  bizHeaders.forEach((h, i) => {
    doc.text(h, x + 2, bizHeaderY, { width: bizColWidths[i] - 4 });
    x += bizColWidths[i];
  });
  doc.y = bizHeaderY + 12;

  bizTypes.forEach((row, idx) => {
    if (doc.y > 700) { addPage(); }
    const rowH = 18;
    const rowY = doc.y + 3;
    if (idx % 2 === 0) {
      doc.rect(72, doc.y, 615, rowH).fill('#f8f7f4');
    }
    x = 72;
    doc.fontSize(7).fillColor(NAVY);
    row.forEach((cell, i) => {
      if (i === 0) doc.font('Helvetica-Bold').fillColor(TEAL);
      else doc.font('Helvetica').fillColor('#333333');
      doc.text(cell, x + 2, rowY, { width: bizColWidths[i] - 4, lineBreak: false });
      x += bizColWidths[i];
    });
    doc.y = rowY + 14;
  });

  // ── RESOURCES ────────────────────────────────────────────────────────────
  addPage();
  heading1('Key Resources & Links');

  heading2('Federal Government Resources');
  bullet('SAM.gov — Federal vendor registration (mandatory)');
  bullet('USASpending.gov — Research past contract awards');
  bullet('SBIR.gov — R&D grant and contract opportunities');
  bullet('certify.SBA.gov — All SBA certifications (8a, HUBZone, WOSB)');
  bullet('IRS.gov/EIN — Free EIN application');
  bullet('CPARS.gov — Contractor performance ratings');

  heading2('Maryland-Specific Resources');
  bullet('dat.maryland.gov — Maryland SDAT (LLC registration)');
  bullet('marylandtaxes.gov — Maryland Tax Connect');
  bullet('emmd.maryland.gov — eMMA state procurement portal');
  bullet('mdot.maryland.gov/MBE — Maryland MBE/DBE certification');
  bullet('ptac.umd.edu — Maryland PTAC (free contracting assistance)');
  bullet('onestop.md.gov — Maryland OneStop business licensing');
  bullet('dllr.maryland.gov — Department of Labor, Licensing & Regulation');
  bullet('bpw.maryland.gov — Board of Public Works (major state contracts)');

  heading2('Business Credit Resources');
  bullet('Dun & Bradstreet: dnb.com — Business credit monitoring');
  bullet('Experian Business: experian.com/business — Business credit reports');
  bullet('Equifax Business: equifax.com/business — Business credit scores');
  bullet('Nav.com — Free business credit monitoring (all 3 bureaus)');
  bullet('Uline.com — First net-30 vendor account');
  bullet('Quill.com — Second net-30 vendor account');

  heading2('Business Tools');
  bullet('Wave.com — Free accounting software');
  bullet('QuickBooks.com — Most popular accounting ($30/mo)');
  bullet('Gusto.com — Payroll software ($40/mo)');
  bullet('NEXT Insurance — Fast business insurance with same-day COI');
  bullet('Northwest Registered Agent — Registered agent service ($125/yr)');
  bullet('Google Workspace — Professional email and productivity ($6/user/mo)');

  sectionDivider();

  doc.fontSize(9).fillColor(GRAY).font('Helvetica-Oblique')
     .text('This guide is for informational and educational purposes only. Consult a licensed attorney, CPA, or business advisor for advice specific to your situation. Laws and fees change — verify all information at official government websites.', { align: 'center' });

  return doc;
}

module.exports = { generateBusinessMasteryPDF };
