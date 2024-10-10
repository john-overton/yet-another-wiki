
# RFP Application

  

## Summary:

To start with this an application that will allow contracting companies an easier way to manage RFP's

  

## Problems to resolve:

1. It takes a long time to read an RFP and outline key aspects of an RFP.

2. It takes a long time to put together summaries to share with an executive team to ensure the RFP is a good fit.

3. It takes a long time to put together a response, share it with the group, and ensure you are properly

4. Capturing questions for procurement can be cumbersome. This could allow for concise communication on specific RFP's.

5. Extra documents are sometimes hard to follow. This simplifies each RFP document and keeps your summaries together for each new amendment and update

6. It's sometimes hard to track deadlines for the RFP.

  

## Features:

 - Ability to setup folders and upload RFP documents

 - Automatic parsing of summaries from RFP document attachments (Using AI)

 - Set summary questions to generate summary documents of RFP

 - Set "Am I good fit?" questions to generate areas of concern documentation (Using AI)

 - Automatic schedule of RFP milestones\events (Parsed from AI)

 - Ask questions against the RFP (Using AI)

 - Automatically capture questions that are not answered in the RFP

 - Comments and voting section to decide if the organization will repond to the RFP

 - Automatic responses for no-bids

 - Compare responses against RFP and to find any missing documentation that is required in the RFP response

 - Compare health of response against the RFP

 - Functionality for users to be members of organization units within the software. RFP's will exist within each organizational unit and only certain users will have specific access to functions within that organization unit. This is to facilitate multiple departments, sub companies, etc to be able to organize their procurement separately.

 - Billing\Invoicing - should be broken down by total users, and usage by organizational unit

 - Users have the ability to switch between organizational units

 - OU's contain folders that RFP's live in and each RFP is its own object which contains all RFP's and relevant attachments that can be downloaded

 - Voting: each RFP gets a go\no-go vote

 - Generate responsibility checklist once a go-vote is achieved

 - Email notifications for new RFP's, new uploaded documents, new comments, summaries, voting open and closing, go-no go results and responsibilities breakdowns

 - Reports on usage (users, OU's, RFP reviews, go-no goes by time frame etc)

 - Search ability for all RFP's in the departments that as a user you are tied to
 - Alerts and activity updates, be able to follow any RFP and decide what RFP section you want to receive updates on

- Ability to setup organizational structure (companies, sub-companies, departments) which act as folders for RFPs
- Automatic parsing of summaries from RFP document attachments (Using AI)
- Set summary questions to generate summary documents of RFP
- Set "Am I a good fit?" questions to generate areas of concern documentation (Using AI)
- Automatic schedule of RFP milestones\events (Parsed from AI)
- Ask questions against the RFP (Using AI)
- Automatically capture questions that are not answered in the RFP
- Comments and voting section to decide if the organization will respond to the RFP
- Configurable automatic responses for no-bids at company, sub-company, or department level
- Compare responses against RFP to find any missing documentation that is required in the RFP response
- Compare health of response against the RFP using AI analysis
- Functionality for users to be members of organization units within the software. RFPs will exist within each organizational unit and only certain users will have specific access to functions within that organization unit. This is to facilitate multiple departments, sub-companies, etc. to be able to organize their procurement separately.
- Billing\Invoicing - broken down by RFP usage, rolled up to the parent company level for reporting, with the ability to have separate billing accounts for sub-companies
- Users have the ability to switch between organizational units
- Generate responsibility checklist once a go-vote is achieved
- Email notifications for new RFPs, new uploaded documents, new comments, summaries, voting open and closing, go-no go results and responsibilities breakdowns
- Reports on usage (RFP reviews, go-no goes by time frame etc.)
- Search ability for all RFPs in the departments that a user is tied to
- Alerts and activity updates, be able to follow any RFP and decide what RFP section you want to receive updates on
- Close-out feature for RFPs, represented by a lock icon in the navigation menu, preventing further modifications while maintaining history

## Business Model

- Base Tier
  - 1 RFP per month included
  - Up to 50 questions per RFP
  - $10 for each additional RFP
  - Slow processing - RFP processing is throttled approx (up to 15 minute process time)
- Business Tier - $99 per month
  - 15 RFPs included per month
  - up to 150 questions per RFP
  - $10 for each additional RFP
  - Fast processing - RFP processing is not throttled (1-5 minute process time)
- Enterprise Tier - $300 per month
  - 40 RFPs per month
  - up to 300 questions per RFP
  - $10 for each additional RFP
  - Fast processing - RFP processing is not throttled (1-5 minute process time)

## Organizational Structure

- Companies can have departments and sub-companies
- Sub-companies can have their own departments
- Each level (company, sub-company, department) can have its own cost center for easier accounting
- Billing is rolled up to the parent company level for reporting, but sub-companies can have separate payment methods and billing accounts

## User Roles and Permissions

- Admins: Manage all aspects of the company or sub-company assigned
- Power Users: Can add RFPs, adjust company/department settings, manage user access, and assign voting rights
- Users: Can comment on RFPs and vote if given voting rights

## RFP Processing and AI Integration

- Automatic parsing of RFP documents using AI (Google Gemini API)
- AI-generated summaries, schedules, and question capturing
- AI-powered health check for RFP responses

## Response Management

- Upload feature for RFP responses
- AI-powered comparison of response against the original RFP and amendments
- Highlights areas needing clarification or missing information

## No-Bid Management

- Configurable AI-generated no-bid responses at company, sub-company, or department level
- Incorporates company information and relevant details from the RFP