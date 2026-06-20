const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ─── SUBSCRIBE ENDPOINT ──────────────────────────────────────────────────────
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  try {
    await addToMailchimp(email);
    const pdfBuffer = await generatePDF();
    await sendPDFEmail(email, pdfBuffer);
    res.json({ success: true, message: 'Check your email for the guide!' });
  } catch (err) {
    console.error('Subscribe error:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// ─── MAILCHIMP ───────────────────────────────────────────────────────────────
async function addToMailchimp(email) {
  const { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, MAILCHIMP_SERVER } = process.env;
  if (!MAILCHIMP_API_KEY) { console.warn('Mailchimp not configured'); return; }
  const url = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;
  await axios.post(url, {
    email_address: email,
    status: 'subscribed',
    tags: ['bizmastery-guide'],
    merge_fields: { SOURCE: 'BizMastery PDF Guide' }
  }, {
    headers: { Authorization: `Bearer ${MAILCHIMP_API_KEY}`, 'Content-Type': 'application/json' }
  });
}

// ─── PDF GENERATOR ───────────────────────────────────────────────────────────
function generatePDF() {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 60, size: 'LETTER' });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const GOLD = '#C9A227';
    const NAVY = '#0A1628';
    const GRAY = '#444441';

    // COVER
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(NAVY);
    doc.fillColor(GOLD).fontSize(42).font('Helvetica-Bold').text('BIZMASTERY', 60, 160, { align: 'center' });
    doc.fillColor('#ffffff').fontSize(22).font('Helvetica').text('Business Zero to Mastery', 60, 220, { align: 'center' });
    doc.fillColor(GOLD).fontSize(13).text('The Complete U.S. Business Launch Guide', 60, 258, { align: 'center' });
    doc.fillColor('#888').fontSize(10).text('All 50 States  ·  100+ Business Types  ·  Government Contracts  ·  Business Credit', 60, 285, { align: 'center' });
    doc.fillColor(GOLD).fontSize(11).font('Helvetica-Bold').text('bizmastery.com', 60, 690, { align: 'center' });

    // TOC
    doc.addPage();
    addHeader(doc, 'Table of Contents', NAVY, GOLD);
    const toc = [
      ['Phase 1','Legal Foundation & Entity Formation'],['Phase 2','Financial Infrastructure'],
      ['Phase 3','Branding & Business Presence'],['Phase 4','Compliance & Insurance'],
      ['Phase 5','Government Contract Registration'],['Phase 6','Certifications for Competitive Advantage'],
      ['Phase 7','Business Credit Building (Tiers 1–4)'],['Phase 8','Finding & Winning Government Contracts'],
      ['Phase 9','Scale & Protect'],['Phase 10','Long-Term Growth'],
      ['Section A','All 50 States Reference Guide'],['Section B','Business Credit Vendor List'],
    ];
    toc.forEach(([label, title]) => {
      doc.fillColor(GOLD).fontSize(10).font('Helvetica-Bold').text(label + '  ', 60, doc.y, { continued: true, width: 80 });
      doc.fillColor(GRAY).font('Helvetica').text(title, { width: 420 });
      doc.moveDown(0.5);
    });

    // PHASES
    const phases = getPhasesData();
    phases.forEach((phase, pi) => {
      doc.addPage();
      addHeader(doc, `Phase ${pi + 1}: ${phase.title}`, NAVY, GOLD);
      phase.steps.forEach((s, si) => {
        if (doc.y > 660) doc.addPage();
        doc.fillColor(GOLD).fontSize(9).font('Helvetica-Bold').text(`STEP ${si + 1}`, 60, doc.y);
        doc.fillColor(NAVY).fontSize(12).font('Helvetica-Bold').text(s.title, 60, doc.y);
        doc.fillColor(GRAY).fontSize(10).font('Helvetica').text(s.desc, 60, doc.y, { width: 490 });
        if (s.tip) {
          doc.moveDown(0.3);
          doc.rect(60, doc.y, 490, 0.5).fill(GOLD);
          doc.moveDown(0.4);
          doc.fillColor('#555555').fontSize(9).font('Helvetica-Oblique').text('Tip: ' + s.tip, 65, doc.y, { width: 480 });
        }
        doc.moveDown(1.2);
      });
    });

    // 50 STATES
    doc.addPage();
    addHeader(doc, 'All 50 States — Business Requirements Reference', NAVY, GOLD);
    const states = getStatesData();
    Object.entries(states).forEach(([state, d]) => {
      if (doc.y > 680) doc.addPage();
      doc.fillColor(NAVY).fontSize(11).font('Helvetica-Bold').text(state, 60, doc.y);
      doc.fillColor(GRAY).fontSize(9).font('Helvetica')
        .text(`LLC Fee: $${d.llcFee}  |  Annual: $${d.annualFee}  |  Due: ${d.annualDue}  |  Corp Tax: ${d.stateTax}  |  Sales Tax: ${d.salesTax}`, 60, doc.y, { width: 490 });
      doc.fillColor('#666666').fontSize(8.5).text(d.notes, 60, doc.y, { width: 490 });
      doc.moveDown(0.9);
    });

    // CREDIT VENDORS
    doc.addPage();
    addHeader(doc, 'Business Credit — Complete Vendor List by Tier', NAVY, GOLD);
    const tiers = [
      { tier: 'Tier 1 — Net-30 Starter Vendors (No Credit Check Required)', vendors: ['Uline.com — Shipping & packaging supplies','Quill.com — Office supplies (reports to D&B Paydex)','Grainger.com — Industrial & safety supplies','Summa Office Supplies — General office products','Crown Office Supplies — Printer paper & ink','Strategic Network Solutions — Tech & IT supplies'] },
      { tier: 'Tier 2 — Retail Business Credit (Apply at 3–6 Months)', vendors: ['Home Depot Pro Business Account','Lowes Business Credit Account','Staples Business Credit Card','Office Depot Business Credit','Sam\'s Club Business Mastercard','Amazon Business Line of Credit','Best Buy Business Advantage Account'] },
      { tier: 'Tier 3 — Fleet & Gas Cards (Apply at 6–9 Months)', vendors: ['WEX Fleet Card (strong D&B reporter)','Shell Fleet Card','Fuelman Fleet Management Card','BP Business Solutions','Chevron/Texaco Business Card'] },
      { tier: 'Tier 4 — Bank Lines & SBA Loans (12–18 Months)', vendors: ['Your own business bank — apply for LOC first','Chase Ink Business Cash (no annual fee)','Capital One Spark Miles for Business','SBA Microloan — up to $50,000','SBA 7(a) Loan — up to $5,000,000','Fundbox — revolving credit line','BlueVine — business line of credit'] }
    ];
    tiers.forEach(t => {
      if (doc.y > 650) doc.addPage();
      doc.fillColor(GOLD).fontSize(11).font('Helvetica-Bold').text(t.tier, 60, doc.y);
      doc.moveDown(0.3);
      t.vendors.forEach(v => doc.fillColor(GRAY).fontSize(10).font('Helvetica').text('  • ' + v, 65, doc.y));
      doc.moveDown(1);
    });

    // BACK COVER
    doc.addPage();
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(NAVY);
    doc.fillColor(GOLD).fontSize(26).font('Helvetica-Bold').text('Your Business Journey Starts Now.', 60, 290, { align: 'center' });
    doc.fillColor('#ffffff').fontSize(13).font('Helvetica').text('Visit bizmastery.com for the full interactive guide,\nstate-by-state tools, and live updates.', 60, 345, { align: 'center' });
    doc.fillColor(GOLD).fontSize(12).text('bizmastery.com', 60, 430, { align: 'center' });
    doc.end();
  });
}

function addHeader(doc, title, navy, gold) {
  const y = doc.y;
  doc.rect(60, y, 490, 38).fill(navy);
  doc.fillColor(gold).fontSize(14).font('Helvetica-Bold').text(title, 70, y + 12, { width: 470 });
  doc.moveDown(2);
}

// ─── EMAIL ───────────────────────────────────────────────────────────────────
async function sendPDFEmail(to, pdfBuffer) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({
    from: `"BizMastery" <${process.env.EMAIL_USER}>`,
    to,
    subject: '📚 Your Business Zero to Mastery Guide is Here!',
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0A1628;padding:30px;text-align:center">
        <h1 style="color:#C9A227;margin:0;font-size:28px">BizMastery</h1>
        <p style="color:#aaa;margin:6px 0 0;font-size:13px">Business Zero to Mastery</p>
      </div>
      <div style="padding:32px;background:#f8f7f4">
        <h2 style="color:#0A1628">Your Free Guide is Attached! 🎉</h2>
        <p style="color:#444;line-height:1.8">Thank you for downloading the <strong>Business Zero to Mastery Guide</strong>. Inside your PDF:</p>
        <ul style="color:#444;line-height:2.2">
          <li>✅ 10-Phase Business Launch Roadmap</li>
          <li>✅ All 50 States — fees, taxes & filing requirements</li>
          <li>✅ Government Contracts step-by-step playbook</li>
          <li>✅ Business Credit Blueprint — Tier 1 through 4</li>
          <li>✅ 100+ Business Type Profiles with launch steps</li>
        </ul>
        <a href="https://bizmastery.com" style="display:inline-block;background:#C9A227;color:#0A1628;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:12px;font-size:15px">
          Open BizMastery →
        </a>
      </div>
      <div style="padding:20px;text-align:center;color:#999;font-size:11px;background:#0A1628">
        © BizMastery · <a href="https://bizmastery.com" style="color:#C9A227">bizmastery.com</a>
      </div>
    </div>`,
    attachments: [{ filename: 'BizMastery-Complete-Guide.pdf', content: pdfBuffer, contentType: 'application/pdf' }]
  });
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
function getPhasesData() {
  return [
    { title: 'Legal Foundation & Entity Formation', steps: [
      { title: 'Obtain Your EIN from IRS', desc: 'Apply at IRS.gov/EIN — free, takes 5 minutes online. This is your business\'s federal tax ID. Required for bank accounts, hiring, and tax filing.', tip: 'After Maryland LLC approval from SDAT, immediately go to IRS.gov. Select LLC, input Maryland as your state. Download and save the CP 575 letter — banks require it.' },
      { title: 'Open a Business Bank Account', desc: 'Never mix personal and business money. Use your EIN (not SSN), LLC articles, and operating agreement to open. Protects liability and is required for government contracts.', tip: 'Chase Business Complete Banking ($15/mo, waived with $2k balance) or BlueVine (free online). Bring: EIN letter, LLC articles, government ID, and $100 minimum deposit.' },
      { title: 'Hire a Registered Agent', desc: 'Maryland requires a registered agent with a physical MD address who can receive legal documents during business hours.', tip: 'Northwest Registered Agent ($125/yr) provides a Maryland address and privacy protection so your home address isn\'t public record.' },
      { title: 'Draft Your Operating Agreement', desc: 'Even for single-member LLCs, this documents ownership, profit sharing, decision-making, and member roles. Banks and agencies often require it.', tip: 'Include: member name and % ownership, profit/loss allocation, dissolution procedure, and banking authorization clause. Date and sign it.' },
      { title: 'Get Maryland Business License', desc: 'Maryland requires specific licenses by county and industry type. General trading licenses cost $15–$150.', tip: 'Check onestop.md.gov — it shows every license you need based on your business type and county. Most service businesses need a county business license plus any state professional license.' }
    ]},
    { title: 'Financial Infrastructure', steps: [
      { title: 'Set Up Business Accounting Software', desc: 'Track every expense from day one for maximum tax deductions. Wave is free; QuickBooks is $30/mo.', tip: 'Set up these categories immediately: Office Supplies, Travel, Marketing, Professional Fees, Equipment, Home Office, Meals (50% deductible).' },
      { title: 'Open a Business Credit Card', desc: 'Apply using your EIN. Start with a secured card ($200–$500 deposit) if no business credit history. This begins building your business credit profile.', tip: 'Capital One Spark Cash Select — no annual fee, 1.5% cash back, reports to D&B and Experian Business. Pay in full monthly. Credit score builds within 90 days.' },
      { title: 'Get UEI Number via SAM.gov', desc: 'The Unique Entity Identifier (replaced DUNS in 2022) is required for ALL federal contracts. You get it when registering at SAM.gov.', tip: 'Go to SAM.gov and click Register Entity. Have ready: EIN, NAICS codes, banking info. Takes 7–10 business days to activate. Do this NOW — before you need it.' },
      { title: 'Set Up Payroll System', desc: 'If you elect S-Corp taxation or hire employees, you need payroll. Gusto ($40/mo) or QuickBooks Payroll.', tip: 'Maryland: Register for employer withholding at marylandtaxes.gov. New employer SUTA rate is 2.3% on first $8,500 of wages. File quarterly MW-506.' },
      { title: 'Understand Maryland Tax Obligations', desc: 'State income tax 2–5.75%, county income tax 2.25–3.2%, sales & use tax 6%, personal property tax on business assets.', tip: 'Annual LLC report due April 15 costs $300. Personal property return (Form 1) also due April 15 — list all equipment and computers. Missing these loses your Good Standing status.' }
    ]},
    { title: 'Branding & Business Presence', steps: [
      { title: 'Register Your DBA / Trade Name', desc: 'If operating under a name different from your LLC, file a Trade Name in Maryland for $25 at SDAT.', tip: 'Example: "Smith Holdings LLC" doing business as "Smith Cleaning Services." File at dat.maryland.gov for $25.' },
      { title: 'Build a Professional Website', desc: 'Required for government contracts, business credit applications, and customer trust. Minimum: homepage, services, about, contact.', tip: 'Gov contracts: your site needs business name matching SAM.gov, physical address, phone, services list, and About Us with founding date. Contracting officers verify websites.' },
      { title: 'Get a Business Phone Number', desc: 'A dedicated business number is required on license applications, bank accounts, and government registrations.', tip: 'Google Voice is free and forwards to your cell. Use this number consistently across SAM.gov, your website, and all applications.' },
      { title: 'Create Professional Business Email', desc: 'Use yourname@yourbusiness.com — never Gmail/Yahoo for formal correspondence. Required by many government agencies.', tip: 'Google Workspace ($6/user/mo). Create: info@, contracts@, and yourname@ email addresses. Government RFP submissions MUST come from a domain email.' }
    ]},
    { title: 'Compliance & Insurance', steps: [
      { title: 'Get Business Insurance', desc: 'General Liability required by most clients and all government contracts. Protects your personal assets.', tip: 'Minimum $1M GL policy ($400–800/year). Government contracts often require $2M aggregate. NEXT Insurance provides same-day Certificate of Insurance (COI).' },
      { title: 'Open a Business PO Box or Virtual Address', desc: 'For privacy, government registrations, and official mail. Required if working from home.', tip: 'iPostal1 ($10/mo) gives you a real street address (not PO Box) — required for SAM.gov registration.' },
      { title: 'File Maryland Annual Report', desc: 'Due April 15 each year. $300 for LLCs. Also file Personal Property Return (Form 1). Missing these forfeits your Good Standing.', tip: 'Set a March 1 calendar reminder. After 2 missed years your LLC can be forfeited — disqualifying you from all state contracts.' },
      { title: 'Maintain Corporate Formalities', desc: 'Annual meeting minutes, financial separation, operational records protect your limited liability.', tip: 'Create a simple Annual Meeting Minutes document each year. Note key decisions, date it, sign it, keep it in your business folder.' }
    ]},
    { title: 'Government Contract Registration', steps: [
      { title: 'Register on SAM.gov', desc: 'Mandatory for all federal contracts and grants. Free. Must renew annually. This is your gateway to $650+ billion in federal spending.', tip: 'Process: (1) Create login.gov account, (2) Go to SAM.gov, click Register Entity, (3) Enter EIN, (4) Select NAICS codes, (5) Complete all sections, (6) Submit for activation.' },
      { title: 'Select Your NAICS Codes', desc: 'North American Industry Classification System codes define what your business does. Choose primary + secondary codes.', tip: 'Consulting=541611 | IT Services=541512 | Construction=236220 | Cleaning=561720 | Staffing=561330 | Food=722310 | Transportation=484110.' },
      { title: 'Register on eMMA (Maryland State)', desc: 'eMaryland Marketplace Advantage lists all state agency solicitations, RFPs, and IFBs. Free registration.', tip: 'emmd.maryland.gov — set up email alerts by commodity code. Complete your vendor profile 100%. Agencies search the database for qualified vendors.' },
      { title: 'Register with County Procurement', desc: "Each of Maryland's 23 counties has its own procurement office — register locally for the fastest first contracts.", tip: 'Charles County: procurement.charlescountymd.gov. Prince George\'s County: pgcps.org. Contracts under $25k are small purchases with less competition.' }
    ]},
    { title: 'Certifications for Competitive Advantage', steps: [
      { title: 'MBE — Minority Business Enterprise', desc: "Maryland's MBE program creates set-aside contracts for minority and women-owned businesses across all state agencies.", tip: 'Apply at mdot.maryland.gov. Submit 3 years tax returns, business license, articles, operating agreement, bank statements. Approval takes 45–90 days.' },
      { title: 'SBA Small Business Certifications', desc: 'Federal certifications: 8(a) Business Development, HUBZone, WOSB, SDVOSB. Each provides dedicated set-aside contracts.', tip: 'All free at certify.SBA.gov. HUBZone: check sba.gov/hubzone with your zip code — could qualify immediately. 8(a) takes 90–120 days.' },
      { title: 'DBE — Disadvantaged Business Enterprise', desc: 'For federally-funded transportation, highway, and infrastructure projects. Administered by MDOT.', tip: 'Apply simultaneously with MBE — much of the paperwork overlaps. Managed at mdot.maryland.gov.' },
      { title: 'ISO Certifications (Larger Contracts)', desc: 'ISO 9001 (Quality Management) often required for defense and large government contracts over $500k.', tip: 'Start pursuing ISO 9001 6–12 months into contracting. Cost $5k–$15k for initial certification.' }
    ]},
    { title: 'Business Credit Building (Tiers 1–4)', steps: [
      { title: 'Tier 1 — Establish Your Credit File', desc: 'Open net-30 vendor accounts that report to business credit bureaus. No credit check required.', tip: 'Start with Uline, Quill, and Grainger. Pay early. After 90 days of on-time payments your D&B Paydex score will be established above 80.' },
      { title: 'Tier 2 — Retail Business Credit (3–6 months)', desc: 'Apply for store credit at business-focused retailers after establishing Tier 1 history.', tip: 'Order: Home Depot Business, Staples, Amazon Business Line. Limits start at $500–$2,000. Pay full balance monthly.' },
      { title: 'Tier 3 — Fleet & Gas Cards (6–9 months)', desc: 'Fleet cards build significant business credit and are useful for any business with vehicles.', tip: 'WEX Fleet and Shell Fleet often approve based on business credit only. Use for all business fuel and vehicle expenses.' },
      { title: 'Tier 4 — Bank Lines & SBA Loans (12–18 months)', desc: 'Apply for business lines of credit and SBA loans after 12–18 months of solid payment history.', tip: 'Apply in order: your own bank, SBA Microloan ($50k max), SBA 7(a) up to $5M, then Fundbox or BlueVine for revolving credit.' }
    ]},
    { title: 'Finding & Winning Government Contracts', steps: [
      { title: 'Research on SAM.gov Daily', desc: 'Search by NAICS codes, set-aside type, and agency. Set up email alerts for new solicitations.', tip: 'Respond to Sources Sought notices before full RFPs are posted — gets your name in front of contracting officers and shapes the final requirements.' },
      { title: 'Use USASpending.gov for Intelligence', desc: 'See who won contracts, how much, and from which agencies. Essential market research before bidding.', tip: 'Search your NAICS code for the past 2 years. Identify: top agencies, average contract size, your competition, and most common set-asides used.' },
      { title: 'Write Your Capabilities Statement', desc: '1-2 page professional document that is your business\'s resume for government contracting.', tip: 'Must include: NAICS codes, CAGE code, UEI number, core competencies, past performance examples, certifications, and contact info. Keep it to 1 page.' },
      { title: 'Use Maryland PTAC (Free Coaching)', desc: 'Procurement Technical Assistance Center at University of Maryland — free proposal reviews and matchmaking.', tip: 'ptac.umd.edu — former contracting officers review your SAM.gov profile, capabilities statement, and proposals at zero cost.' }
    ]},
    { title: 'Scale & Protect', steps: [
      { title: 'S-Corp Tax Election', desc: 'Once netting $50,000+ annually, S-Corp tax status saves significant self-employment taxes. File Form 2553 with IRS.', tip: 'Example: $100k LLC net = ~$15,300 SE tax. Same income as S-Corp (paying $50k salary + $50k distribution) saves ~$7,650/year. Consult your CPA first.' },
      { title: 'Hire a Business CPA', desc: 'Government contractors have unique tax situations. A specialized CPA pays for themselves 5–10x over.', tip: 'Cost $800–$3k/year. Finds: home office deductions, Section 179 equipment depreciation, SEP-IRA up to $66k/year, vehicle deductions, health insurance deductions.' },
      { title: 'Build Subcontracting Network', desc: 'Prime contractors must subcontract percentages to small/minority businesses. Build those relationships.', tip: 'Email Small Business Liaison Officers (SBLOs) at large prime contractors with your capabilities statement and certifications.' },
      { title: 'Document Past Performance', desc: 'Past performance is the #1 evaluation factor in government contracts. Document every project now.', tip: 'Track: Project Name | Client | Contract Value | Period | Role | Services | Outcome | Reference Contact. Build from private sector clients immediately.' }
    ]},
    { title: 'Long-Term Growth', steps: [
      { title: 'Graduate to SBA 8(a) Program', desc: '9-year mentorship and contracting program for socially/economically disadvantaged businesses.', tip: 'Apply at certify.SBA.gov. Personal net worth under $750k, adjusted gross income under $350k average over 3 years. Takes 90–120 days.' },
      { title: 'Pursue GSA Schedule Contract', desc: 'Pre-negotiated contract allowing federal agencies to buy directly without formal bidding. $600B+ in GSA spending annually.', tip: 'Requires 2+ years in business and $25k+ in revenue. Apply at gsa.gov/schedules. Takes 3–6 months. Stays active 5 years, renewable.' },
      { title: 'Expand to Virginia & DC', desc: 'The DMV region has $150B+ in annual federal contracting. Register as foreign LLC in Virginia ($100) and Delaware ($90).', tip: 'Virginia SCC: scc.virginia.gov. DC BEGA: bega.dc.gov. Both allow online registration. Expands your eligible contract geographic scope significantly.' },
      { title: 'Joint Ventures & Mentor-Protégé', desc: 'Partner with larger companies to pursue contracts too large for either company alone.', tip: 'SBA Mentor-Protégé Program: you provide small business set-aside certifications; mentor provides bonding, past performance, and capacity. Both benefit.' }
    ]}
  ];
}

function getStatesData() {
  return {
    "Alabama":{"llcFee":236,"annualFee":100,"annualDue":"April 15","stateTax":"6.5%","salesTax":"4%","notes":"Must publish notice of formation in newspaper. Privilege tax based on net worth."},
    "Alaska":{"llcFee":250,"annualFee":100,"annualDue":"Jan 2","stateTax":"0%","salesTax":"0%","notes":"No state income tax or sales tax. Biennial report every 2 years. Very business-friendly for taxes."},
    "Arizona":{"llcFee":50,"annualFee":0,"annualDue":"None","stateTax":"4.9%","salesTax":"5.6%","notes":"No annual report fee. Low formation cost. Transaction Privilege Tax instead of traditional sales tax."},
    "Arkansas":{"llcFee":45,"annualFee":150,"annualDue":"May 1","stateTax":"5.3%","salesTax":"6.5%","notes":"Annual franchise tax report required. Low formation cost."},
    "California":{"llcFee":70,"annualFee":800,"annualDue":"15th day 4th month","stateTax":"8.84%","salesTax":"7.25%","notes":"$800 minimum franchise tax annually. Additional gross receipts fee. Statement of Information due every 2 years ($20)."},
    "Colorado":{"llcFee":50,"annualFee":10,"annualDue":"Annually","stateTax":"4.4%","salesTax":"2.9%","notes":"Very low annual report fee. Periodic report due by end of anniversary month. Business-friendly overall."},
    "Connecticut":{"llcFee":120,"annualFee":80,"annualDue":"March 31","stateTax":"7.5%","salesTax":"6.35%","notes":"Annual report required. Business Entity Tax repealed in 2019. Strong finance and insurance economy."},
    "Delaware":{"llcFee":90,"annualFee":300,"annualDue":"June 1","stateTax":"8.7%","salesTax":"0%","notes":"Most popular for incorporation due to Court of Chancery and flexible laws. No sales tax. Best for seeking investors."},
    "Florida":{"llcFee":125,"annualFee":138.75,"annualDue":"May 1","stateTax":"5.5%","salesTax":"6%","notes":"No personal income tax. Annual report required. $400 late fee if missed. Strong business environment."},
    "Georgia":{"llcFee":100,"annualFee":50,"annualDue":"April 1","stateTax":"5.75%","salesTax":"4%","notes":"Annual registration required. Low annual fee. No separate LLC tax if pass-through."},
    "Hawaii":{"llcFee":50,"annualFee":15,"annualDue":"Varies","stateTax":"6.4%","salesTax":"4%","notes":"General Excise Tax (GET) applies to ALL business receipts at 4% — acts more like a sales tax on everything."},
    "Idaho":{"llcFee":100,"annualFee":0,"annualDue":"None","stateTax":"5.8%","salesTax":"6%","notes":"No annual report fee after formation. Business-friendly environment with growing tech sector in Boise."},
    "Illinois":{"llcFee":150,"annualFee":75,"annualDue":"Before 1st day of anniversary month","stateTax":"9.5%","salesTax":"6.25%","notes":"High corporate tax. Personal Property Replacement Tax of 1.5% for LLCs. Chicago has additional city taxes."},
    "Indiana":{"llcFee":95,"annualFee":32,"annualDue":"Annually","stateTax":"4.9%","salesTax":"7%","notes":"Low flat corporate tax rate. Biennial report every 2 years. Business Income Tax only applies if taxed as corp."},
    "Iowa":{"llcFee":50,"annualFee":60,"annualDue":"April 1","stateTax":"8.4%","salesTax":"6%","notes":"Biennial report required. Corporate tax rate schedule decreasing each year through 2026."},
    "Kansas":{"llcFee":160,"annualFee":55,"annualDue":"15th day of 4th month","stateTax":"4%","salesTax":"6.5%","notes":"Annual report required. Privilege tax applies. Small business tax incentives available."},
    "Kentucky":{"llcFee":40,"annualFee":15,"annualDue":"June 30","stateTax":"5%","salesTax":"6%","notes":"Very low fees across the board. LLC Occupational License Tax may apply in some counties."},
    "Louisiana":{"llcFee":100,"annualFee":35,"annualDue":"Anniversary month","stateTax":"7.5%","salesTax":"4.45%","notes":"Annual report required. Parish-level taxes and licenses also required. High overall tax burden."},
    "Maine":{"llcFee":175,"annualFee":85,"annualDue":"June 1","stateTax":"8.93%","salesTax":"5.5%","notes":"Annual report required. High income tax rates. Strong small business support programs."},
    "Maryland":{"llcFee":100,"annualFee":300,"annualDue":"April 15","stateTax":"8.25%","salesTax":"6%","notes":"Annual LLC report $300. Personal property return (Form 1) also due April 15. County income taxes 2.25–3.2%. Excellent for federal contracting — home to NSA, NIH, SSA, USACE."},
    "Massachusetts":{"llcFee":500,"annualFee":500,"annualDue":"Annually","stateTax":"8%","salesTax":"6.25%","notes":"Highest LLC formation and annual fees in the country. Strong biotech, finance, and education economy."},
    "Michigan":{"llcFee":50,"annualFee":25,"annualDue":"February 15","stateTax":"6%","salesTax":"6%","notes":"Low annual fee. Annual statement required. Flat corporate income tax rate."},
    "Minnesota":{"llcFee":155,"annualFee":0,"annualDue":"Dec 31 (free)","stateTax":"9.8%","salesTax":"6.875%","notes":"Annual renewal is free. High income tax but strong social infrastructure and healthcare economy."},
    "Mississippi":{"llcFee":50,"annualFee":0,"annualDue":"April 15","stateTax":"5%","salesTax":"7%","notes":"Annual report is free. One of lowest filing fees. Low overall cost of doing business."},
    "Missouri":{"llcFee":105,"annualFee":0,"annualDue":"None","stateTax":"4%","salesTax":"4.225%","notes":"No annual report requirement for LLCs. One of easiest states for LLC maintenance. Low taxes."},
    "Montana":{"llcFee":35,"annualFee":15,"annualDue":"April 15","stateTax":"6.75%","salesTax":"0%","notes":"No sales tax. Very low fees. Great state for holding real estate or assets for tax purposes."},
    "Nebraska":{"llcFee":100,"annualFee":13,"annualDue":"April 1","stateTax":"7.25%","salesTax":"5.5%","notes":"Biennial occupation tax based on paid-in capital. Low annual fee."},
    "Nevada":{"llcFee":75,"annualFee":200,"annualDue":"Last day of anniversary month","stateTax":"0%","salesTax":"6.85%","notes":"No corporate or personal income tax. Strong privacy protections — no public member disclosure. Second most popular state after Delaware for holding companies."},
    "New Hampshire":{"llcFee":100,"annualFee":100,"annualDue":"April 1","stateTax":"7.5%","salesTax":"0%","notes":"No sales tax or income tax on wages. Business Profits Tax and Business Enterprise Tax apply to profits."},
    "New Jersey":{"llcFee":125,"annualFee":75,"annualDue":"Annually","stateTax":"9%","salesTax":"6.625%","notes":"High overall tax burden. CBT minimum $500 for corps. High cost but access to large NYC/Philadelphia market."},
    "New Mexico":{"llcFee":50,"annualFee":0,"annualDue":"None","stateTax":"5.9%","salesTax":"5%","notes":"No annual report for LLCs. Very low maintenance cost. Gross Receipts Tax instead of traditional sales tax."},
    "New York":{"llcFee":200,"annualFee":9,"annualDue":"Biennial","stateTax":"6.5%","salesTax":"4%","notes":"PUBLICATION REQUIREMENT: Must publish in two newspapers for 6 weeks ($1,000–$2,000 total cost). Annual fee only $9 but startup cost high. NYC adds additional city taxes."},
    "North Carolina":{"llcFee":125,"annualFee":200,"annualDue":"April 15","stateTax":"2.5%","salesTax":"4.75%","notes":"Corporate tax rate declining to 0% by 2030. Research Triangle is major tech and pharma hub. Annual report required."},
    "North Dakota":{"llcFee":135,"annualFee":50,"annualDue":"Nov 15","stateTax":"4.31%","salesTax":"5%","notes":"Annual report required. Low population but favorable tax environment and growing economy."},
    "Ohio":{"llcFee":99,"annualFee":0,"annualDue":"None","stateTax":"0%","salesTax":"5.75%","notes":"No corporate income tax. Commercial Activity Tax (CAT) based on gross receipts instead. No annual report for LLCs."},
    "Oklahoma":{"llcFee":104,"annualFee":25,"annualDue":"Anniversary month","stateTax":"4%","salesTax":"4.5%","notes":"Annual certificate of compliance required. Low overall taxes. Strong oil, gas, and aerospace industries."},
    "Oregon":{"llcFee":100,"annualFee":100,"annualDue":"Anniversary month","stateTax":"6.6%","salesTax":"0%","notes":"No sales tax. Annual report required. Corporate Activity Tax applies to businesses over $1M gross receipts."},
    "Pennsylvania":{"llcFee":125,"annualFee":7,"annualDue":"Decennial (every 10 years)","stateTax":"9.99%","salesTax":"6%","notes":"High corporate tax rate. Decennial report required every 10 years. Very low ongoing maintenance fee."},
    "Rhode Island":{"llcFee":150,"annualFee":50,"annualDue":"Nov 1","stateTax":"7%","salesTax":"7%","notes":"Annual report required. Small state with relatively high tax rates. Strong coastal economy."},
    "South Carolina":{"llcFee":110,"annualFee":0,"annualDue":"None","stateTax":"5%","salesTax":"6%","notes":"No annual report for LLCs. Low maintenance cost. License Tax based on paid-in capital applies."},
    "South Dakota":{"llcFee":150,"annualFee":50,"annualDue":"Anniversary month","stateTax":"0%","salesTax":"4.5%","notes":"No corporate or personal income tax. Strong privacy laws. Annual report required. Very business-friendly — popular for trust and financial companies."},
    "Tennessee":{"llcFee":300,"annualFee":300,"annualDue":"April 1","stateTax":"6.5%","salesTax":"7%","notes":"High LLC fees but no income tax on wages (Hall Tax on investment income repealed 2021). Franchise and Excise Tax applies. Strong healthcare and distribution economy."},
    "Texas":{"llcFee":300,"annualFee":0,"annualDue":"May 15 (franchise tax report)","stateTax":"0%","salesTax":"6.25%","notes":"No personal income tax. Franchise Tax only applies if gross receipts over $1.23M. No annual report fee. One of strongest business economies in the U.S."},
    "Utah":{"llcFee":70,"annualFee":18,"annualDue":"Anniversary month","stateTax":"4.85%","salesTax":"4.85%","notes":"Very low annual fee. Low flat tax rate. Silicon Slopes tech corridor. Business-friendly environment."},
    "Vermont":{"llcFee":125,"annualFee":35,"annualDue":"March 15","stateTax":"8.5%","salesTax":"6%","notes":"Annual report required. High personal income tax. Small but innovation and renewable energy focused economy."},
    "Virginia":{"llcFee":100,"annualFee":50,"annualDue":"Last day of 12th month","stateTax":"6%","salesTax":"4.3%","notes":"Strong federal contracting market near DC and Pentagon. No franchise tax on LLCs. Annual registration fee required."},
    "Washington":{"llcFee":180,"annualFee":60,"annualDue":"Anniversary month","stateTax":"0%","salesTax":"6.5%","notes":"No personal or corporate income tax. Business and Occupation (B&O) Tax on gross receipts. Annual report required. Major tech hub (Seattle)."},
    "West Virginia":{"llcFee":100,"annualFee":25,"annualDue":"June 30","stateTax":"6.5%","salesTax":"6%","notes":"Annual report required. Low annual fee. Business and Occupation Tax applies to certain activities."},
    "Wisconsin":{"llcFee":130,"annualFee":25,"annualDue":"Quarterly","stateTax":"7.9%","salesTax":"5%","notes":"Annual report filed quarterly. Manufacturing and Agriculture credit reduces effective tax rate. Strong dairy and manufacturing economy."},
    "Wyoming":{"llcFee":100,"annualFee":52,"annualDue":"First day of anniversary month","stateTax":"0%","salesTax":"4%","notes":"No corporate or personal income tax. Strongest privacy protections in the U.S. Top choice for holding companies and asset protection LLCs."}
  };
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BizMastery running on port ${PORT}`));
