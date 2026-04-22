import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface BookingFormData {
  _service: string;
  _budget: string;
  _pages: string;
  _quickness: string;
  first: string;
  phone: string;
  email: string;
  company: string;
  websiteUrl?: string;
  message: string;
  honeypot?: string; // Hidden field to catch bots
}

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize input to prevent XSS
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Format service type for display
const formatServiceType = (service: string): string => {
  const serviceMap: Record<string, string> = {
    'design/branding': 'Design/Branding',
    'web-dev': 'Web Development',
    'mobile-dev': 'Mobile Development',
    'all-types': 'All of the above',
    'other-service': 'Other',
  };
  return serviceMap[service] || service;
};

// Format budget for display
const formatBudget = (budget: string): string => {
  const budgetMap: Record<string, string> = {
    '<1': '< $1000',
    '2-4': '$2000 - $4000',
    '4-8': '$4000 - $8000',
    '8-10': '$8000 - $10000',
    '10+': '> $10000',
  };
  return budgetMap[budget] || budget;
};

// Format pages for display
const formatPages = (pages: string): string => {
  const pagesMap: Record<string, string> = {
    '<5': 'Less than 5',
    '6-10': '6-10',
    '11-20': '11-20',
    '20+': '20+',
  };
  return pagesMap[pages] || pages;
};

// Format quickness for display
const formatQuickness = (quickness: string): string => {
  const quicknessMap: Record<string, string> = {
    'max-fast': 'As fast as possible',
    'high-prio': 'High priority',
    'regular': 'Regular time',
    'take-your-time': 'Take your time',
  };
  return quicknessMap[quickness] || quickness;
};

export async function POST(req: NextRequest) {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailTo = process.env.EMAIL_TO || emailUser;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpSecure = process.env.SMTP_SECURE === 'true';

    if (!emailUser || !emailPass) {
      console.error('Missing SMTP credentials in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact the administrator.' },
        { status: 500 }
      );
    }

    // Parse request body
    const body: BookingFormData = await req.json();
    const {
      _service,
      _budget,
      _pages,
      _quickness,
      first,
      email,
      phone,
      company,
      websiteUrl,
      message,
      honeypot,
    } = body;

    // Honeypot check - if this field is filled, it's likely a bot
    if (honeypot && honeypot.trim() !== '') {
      // Silently fail for bots (don't reveal we detected them)
      return NextResponse.json({ success: true });
    }

    // Server-side validation
    if (!first || !email || !phone || !company || !_service || !_budget || !_pages || !_quickness) {
      return NextResponse.json(
        { error: 'All required fields must be filled.' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(first);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedCompany = sanitizeInput(company);
    const sanitizedWebsite = websiteUrl ? sanitizeInput(websiteUrl) : 'Not provided';
    const sanitizedMessage = message ? sanitizeInput(message) : 'No additional message';

    // Validate sanitized inputs aren't empty
    if (!sanitizedName || !sanitizedEmail || !sanitizedPhone || !sanitizedCompany) {
      return NextResponse.json(
        { error: 'Invalid input detected. Please check your form fields.' },
        { status: 400 }
      );
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    // Email content
    const mailOptions = {
      from: `"${sanitizedName}" <${emailUser}>`,
      replyTo: sanitizedEmail,
      to: emailTo,
      subject: `New Project Request from ${sanitizedName} - ${sanitizedCompany}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 15px; margin-top: 0;">
              New Project Request
            </h2>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #4CAF50; margin-top: 0;">Contact Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 150px;"><strong>Name:</strong></td>
                  <td style="padding: 8px 0;">${sanitizedName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0;"><a href="mailto:${sanitizedEmail}" style="color: #4CAF50;">${sanitizedEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
                  <td style="padding: 8px 0;">${sanitizedPhone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Company:</strong></td>
                  <td style="padding: 8px 0;">${sanitizedCompany}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Website:</strong></td>
                  <td style="padding: 8px 0;">${sanitizedWebsite !== 'Not provided' ? `<a href="${sanitizedWebsite}" style="color: #4CAF50;">${sanitizedWebsite}</a>` : sanitizedWebsite}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #4CAF50; margin-top: 0;">Project Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 150px;"><strong>Service Type:</strong></td>
                  <td style="padding: 8px 0;">${formatServiceType(_service)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Budget:</strong></td>
                  <td style="padding: 8px 0;">${formatBudget(_budget)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Pages:</strong></td>
                  <td style="padding: 8px 0;">${formatPages(_pages)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Timeline:</strong></td>
                  <td style="padding: 8px 0;">${formatQuickness(_quickness)}</td>
                </tr>
              </table>
            </div>

            <div style="margin: 20px 0;">
              <h3 style="color: #4CAF50;">Project Description</h3>
              <div style="background-color: #fff; padding: 15px; border-left: 4px solid #4CAF50; border-radius: 3px; white-space: pre-wrap;">
                ${sanitizedMessage.replace(/\n/g, '<br>')}
              </div>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center; margin-bottom: 0;">
              This email was sent from your portfolio booking form on ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
      text: `
New Project Request

CONTACT INFORMATION
Name: ${sanitizedName}
Email: ${sanitizedEmail}
Phone: ${sanitizedPhone}
Company: ${sanitizedCompany}
Website: ${sanitizedWebsite}

PROJECT DETAILS
Service Type: ${formatServiceType(_service)}
Budget: ${formatBudget(_budget)}
Pages: ${formatPages(_pages)}
Timeline: ${formatQuickness(_quickness)}

PROJECT DESCRIPTION
${sanitizedMessage}

---
Sent on ${new Date().toLocaleString()}
      `.trim(),
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Success response
    return NextResponse.json({ success: true });
  } catch (error) {
    // Log error for debugging (don't expose sensitive info to client)
    console.error('Contact form error:', error);

    // Return generic error message
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later or contact us directly.' },
      { status: 500 }
    );
  }
}
