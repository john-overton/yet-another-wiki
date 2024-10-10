# Organizational Setup

## Summary
This is the outline for how organizational setup should work within the application. Each user may be a member of certain objects within the organizational structure.

```markdown
└── Company
    ├── Department
    └── Sub company
        ├── Department
```

## Descriptions

- **Company:** The top-line structure managed by admin(s)
  - Contains primary billing information
  - Controls company-wide user assignment
- **Department:** A sub-object of Company or Sub company
- **Sub Company:** A sub-object of the Company which can have separate billing. Sub companies can also contain separate departments.

## Setup for each Organizational Unit (OU) should contain:

- Name
- OU Type (Company, Department, Sub Company)
- Authentication type: (regular email, Microsoft SSO, Google SSO)
- Domain (email domain example: @jroverton.com)
- Billing setup
  - Inherited (default) or separate billing
  - Payment method
  - Billing address
  - Cost center
- User list with roles and voting rights
- No-bid response template

## User Roles

- **Admins**
  - Manage all aspects of the company or sub-company assigned
  - Set up and manage billing
  - Assign roles and permissions to other users
- **Power Users**
  - Can add RFPs and adjust company/department settings
  - Can add/terminate user access to Power User assigned company or departments
  - Can give voting rights to users
- **Users**
  - Can comment on RFPs
  - Can vote on RFPs if given voting rights

Special roles: 
- **Voting Rights:** A flag tied to a user at a specific OU level, allowing them to participate in go/no-go decisions.

## Organization Onboarding

Login Integrations:
- Microsoft SSO
- Google SSO
- Email/Password

When a user logs in for the first time, there should be a check based on the domain name of the email to see if a company or sub company exists. If there is, then a notification email should go out to the Admin for that company to decide on whether or not to add that user.

If the domain is being set up for the first time, initiate the company information and billing setup process.

## User Management

- For SSO users, active status should be determined by the SSO provider
- For regular email users, admins have the ability to activate or deactivate user accounts
- Active accounts are included in billing
- Users can be assigned to specific OUs with specific roles and voting rights

## Billing Structure

- Billing is primarily based on RFP usage, not user count
- Invoicing and usage reporting roll up to the parent company level
- Sub-companies can have separate payment methods, billing addresses, and cost centers
- Departments can have their own cost centers for easier accounting

## No-Bid Response Management

- Each OU (Company, Sub Company, Department) can have its own configurable no-bid response template
- Templates inherit from parent OU if not set at the current level
- No-bid responses are generated using AI, incorporating:
  - Company/department information
  - Relevant details from the RFP
  - Customized content from the template

## RFP Management

- RFPs are organized within the OU structure (Company > Sub Company > Department)
- Each OU acts as a "folder" for RFPs within the application
- Users can access RFPs based on their OU membership and permissions

## Reporting and Analytics

- Usage reports (RFP counts, API usage, etc.) are generated at the Company level
- Sub-company and department usage is included in the parent company's reports
- Cost center information allows for detailed accounting and cost allocation