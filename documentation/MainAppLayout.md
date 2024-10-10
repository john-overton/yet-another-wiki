
# Main App Layout

This is a written specification document for the application. All application details should be provided in the document.

## Login Page
The login page should be a panel with three buttons:

- Email
- Microsoft (SSO) - use your Microsoft Account
- Google (SSO) - use your Google Account

## User Roles and Permissions
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

## User Interface

The main user interface should be split into 4 div's broken up into two categories: **Header** and **Main App**. There is also a footer on the bottom of every page specified below.

### Header
**Div 1** is the header, and should span the top of the page completely. This should contain the following:
- Left: A logo for the application, takes the user to the home screen which is the starting page of the main app
- Left: A dropdown of all orgs which will impact the view for the Main App
- Middle: A search bar
  - Should be able to search for RFP names, dates, comments, users
- Right: Notifications - this tells you anytime someone has @mentioned you, or a section of an RFP is updated that you follow
- Right: Account button that has a dropdown menu for user "My Account - which shows the users name (avatar), Company (each company user is a member of should show in the list with an *Active* element for the company that is active in the main app view), Settings, and Logout

### Main App

**Div 2** is a menu on the left with the following functionality (10% size):

- Shows a list of all items in the department or company (depending on the relationship the user has to the org and sub OUs) which a user can click on to affect the other divs in the main screen
  - There should also be an eye icon that allows a user to follow or not follow some RFPs 
  - There will be a spinning indicator if an RFP is processing new data or questions after additional documents or questions have been asked. Show a small green check mark when processing is complete.
  - Add a lock icon for closed-out RFPs that cannot be modified but maintain history
- Has a button to add new RFPs (if Power User)

**Div 3** is the main RFP box and contains several tabs (70% size)

- Files is the first tab
  - This opens the view up into two separate divs, 1 a list of RFP attachments, and the second div is the rendering of the documents (PDFs to start)
  - Use best practices for Next.js 13+ for document rendering
- Summary is the second tab
  - This view contains high level details about the RFP, approximate value, schedule, answers to good fit questions, and a high level analysis of whether or not this may be a good fit on a simple grading of 1-4 (1 being the lowest and worst fit, 4 being the company hits every requirement and is the guardrails for new business)
- Voting is the next tab
  - This tab is where decision makers decide go/no-go. If you are an admin or a part of procurement you can trigger voting at any time and set due date for voting
- The next tab is Questions
  - There should be two views in this tab. One for known questions, and the other for unknown questions. This tab contains a list of all questions about the RFP - the base set of questions will be derived from the fit set during onboarding questions.
  - Users can answer questions, or questions can be answered by attached amendments, or RFP agency answers to questions pulled from the API.
  - Unanswered questions should be at the top and highlighted yellow
- The next tab is Response
  - This tab allows users to upload response documents
  - It also provides an AI-powered health check that compares the response against the original RFP and amendments
  - Highlights areas needing clarification or missing information
- The final tab is Review
  - This tab is where you can review your response grading against the RFP

**Div 4** is the comments section and on the right of the screen (20% size)

- The comments section is a full historical record of the updates, changes, and user comments of the RFP.
- Based on the tab open the comments are filtered for that specific section.
- Comments utilize MD formatting
- There should be a button or switch at the top of the comment page that shows you all comment history without Div 3 tab filters applied.

### Footer
**Footer** should contain the following
- Left: Button to turn day/night mode on/off
- Center: Copyright, link to terms and privacy, and a notification that says "Some content in this app is AI generated and may not be accurate."
- Right: Provide feedback. This brings up a form that allows a user to make a suggestion or provide feedback. This emails the Application administrator.

## Settings
If the user is an admin or manages a department the user should see settings for that department. These settings include:

- Configuration of the company, department, or sub company (if Admin / Power user)
  - Set the industry
  - Set the onboard questions (what questions do you always ask for each RFP you bid on - limit based on tier (show a question counter and a checkbox for each question to enable/disable, have an add/remove button for questions, and have a notification in this screen after around 75% total available questions that suggest the user should leave room for extra questions for the reviewing process)
  - Upload sample summaries (pdf, text, word, images) relevant to the business
    - **NOTE** all of these settings impact the API calls to the AI service when the app is creating summaries.
  - Ability to invite users or delete users and manage user voting rights
  - Configure no-bid response template
- Billing and Payments (if Admin)
  - Page to set subscription level (company or sub company level)
  - Change billing payment methods
  - Set cost centers for departments
  - Close or cancel the company account
  - View to see usage for company or sub company (grouped by department)
- Account management
  - Change password (if not using SSO)
  - Change Avatar (if not pulled from MS or Google)
  - Delete User (close the user account)
- Provide app rating
  - Rating 1-5 Stars
  - Optional comment
  - Opt in for comment to be shared on application webpage, or social media

## RFP Processing and AI Integration

When a user uploads an RFP and any additional documents:

1. Check RFP numbers for the calendar month and if max RFPs have been reached notify the user they will incur a charge - show the charge amount, and have the user click accept.
2. There should be a processing indicator for the new RFP (spinning circle). The main app window should show "processing, please check back later"
3. While processing the system should call the Google Gemini API and start a context cached conversation for the RFP. This chat will provide full context caching for the RFP to minimize cost.

Step 3 should include the following checks:
1) Add/update RFP dates/milestones/schedule (*2)
2) Add/update RFP Summary (*2)
3) Add any unanswered questions (*1)

**NOTE (1)** Each question should be asked separately, with a prompt that instructs on concise, exact results with references within the RFP document (section number, page #, etc)

**NOTE (2)** Each update should include the previous existing update and explicitly ask if there are any changes, if yes replace the existing data, if not ask for an explicit response of "No changes" do not update the data.

## Search Functionality

The search functionality should index the following:
- RFP names and content
- File names and content (where possible)
- Comments
- User names

The search results should be presented in a categorized manner, allowing users to easily identify the type of content matched (RFP, File, Comment, User).

## Data Objects

### User

-   id: unique identifier
-   email: string
-   name: string
-   avatar: string (URL or file path)
-   authType: enum (Email, Microsoft, Google)
-   role: enum (Admin, PowerUser, User)
-   isActive: boolean
-   companies: array of Company objects (user can belong to multiple)
-   currentActiveCompany: reference to Company object
-   notificationPreferences: object
-   votingRights: boolean


### Company

-   id: unique identifier
-   name: string
-   industry: string
-   domain: string (email domain)
-   authType: enum (Email, Microsoft, Google)
-   billingInfo: object
    -   paymentMethod: string
    -   billingAddress: string
    -   costCenter: string
-   admins: array of User objects
-   departments: array of Department objects
-   subCompanies: array of SubCompany objects
-   users: array of User objects
-   onboardQuestions: array of Question objects
-   sampleSummaries: array of objects (containing file paths or URLs)
-   subscriptionLevel: enum (BaseTier, BusinessTier, EnterpriseTier)
-   noBidTemplate: string


### Department

-   id: unique identifier
-   name: string
-   parentCompany: reference to Company object or SubCompany object
-   users: array of User objects
-   powerUsers: array of User objects
-   costCenter: string
-   noBidTemplate: string (inherits from parent company/subcompany if not set)


### SubCompany

-   id: unique identifier
-   name: string
-   parentCompany: reference to Company object
-   departments: array of Department objects
-   billingInfo: object (if separate billing)
    -   paymentMethod: string
    -   billingAddress: string
    -   costCenter: string
-   users: array of User objects
-   noBidTemplate: string (inherits from parent company if not set)


### RFP

-   id: unique identifier
-   name: string
-   organization: reference to Company, Department, or SubCompany object
-   files: array of File objects
-   summary: object
-   votingStatus: object
-   questions: array of Question objects
-   comments: array of Comment objects
-   status: enum (Processing, Active, Archived, Closed)
-   createdAt: datetime
-   updatedAt: datetime
-   dueDate: datetime
-   estimatedValue: number
-   fitScore: number (1-4)
-   milestones: array of Milestone objects
-   followers: array of User objects
-   aiProcessingStatus: enum (Queued, Processing, Completed, Failed)
-   aiConversationCache: string (or reference to a separate object)
-   responsibilityChecklist: array of Task objects
-   response: File object (uploaded response document)
-   responseHealthCheck: object

### File
- id: unique identifier
- name: string
- type: string (MIME type)
- content: binary or text
- uploadedBy: reference to User object
- uploadedAt: datetime
- rfp: reference to RFP object

### Question
- id: unique identifier
- text: string
- isAnswered: boolean
- answer: string
- rfp: reference to RFP object
- answeredBy: reference to User object (if applicable)
- answeredAt: datetime (if applicable)
- category: enum (Known, Unknown)

### Comment
- id: unique identifier
- text: string
- user: reference to User object
- rfp: reference to RFP object
- createdAt: datetime
- updatedAt: datetime
- relatedSection: enum (Files, Summary, Voting, Questions, Review)

### Task

-   id: unique identifier
-   description: string
-   assignedTo: reference to User object
-   dueDate: datetime
-   status: enum (Pending, InProgress, Completed)
-   rfp: reference to RFP object

### Milestone
- id: unique identifier
- name: string
- date: datetime
- description: string
- rfp: reference to RFP object

### Vote
- id: unique identifier
- user: reference to User object
- rfp: reference to RFP object
- decision: enum (Go, NoGo)
- comments: string
- votedAt: datetime

### Notification
- id: unique identifier
- user: reference to User object
- type: enum (Mention, Update, NewRFP, etc.)
- content: string
- isRead: boolean
- createdAt: datetime
- relatedObject: reference (to RFP, Comment, etc.)

### SearchIndex

-   id: unique identifier
-   entityType: enum (RFP, File, Comment, etc.)
-   entityId: reference to the indexed entity
-   content: text (indexed content for search)
-   metadata: object (additional searchable metadata)


### APIUsage

-   id: unique identifier
-   company: reference to Company object
-   date: date
-   rfpCount: number
-   questionCount: number
-   totalTokensUsed: number

### Feedback
- id: unique identifier
- user: reference to User object
- rating: number (1-5)
- comment: string
- allowSharing: boolean
- createdAt: datetime