-- Users table
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    auth_type TEXT CHECK(auth_type IN ('Email', 'Microsoft', 'Google')) NOT NULL,
    role TEXT CHECK(role IN ('Admin', 'PowerUser', 'User')) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    current_active_company_id INTEGER,
    notification_preferences JSONB,
    voting_rights BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Companies table
CREATE TABLE Companies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT,
    domain TEXT,
    auth_type TEXT CHECK(auth_type IN ('Email', 'Microsoft', 'Google')) NOT NULL,
    billing_info JSONB,
    subscription_level TEXT CHECK(subscription_level IN ('BaseTier', 'BusinessTier', 'EnterpriseTier')) NOT NULL,
    no_bid_template TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SubCompanies table
CREATE TABLE SubCompanies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    parent_company_id INTEGER NOT NULL,
    billing_info JSONB,
    no_bid_template TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_company_id) REFERENCES Companies(id)
);

-- Departments table
CREATE TABLE Departments (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    parent_company_id INTEGER,
    parent_sub_company_id INTEGER,
    cost_center TEXT,
    no_bid_template TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_company_id) REFERENCES Companies(id),
    FOREIGN KEY (parent_sub_company_id) REFERENCES SubCompanies(id)
);

-- RFPs table
CREATE TABLE RFPs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    organization_id INTEGER NOT NULL,
    organization_type TEXT CHECK(organization_type IN ('Company', 'Department', 'SubCompany')) NOT NULL,
    summary TEXT,
    status TEXT CHECK(status IN ('Processing', 'Active', 'Archived', 'Closed')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP WITH TIME ZONE,
    estimated_value DECIMAL(10, 2),
    fit_score INTEGER CHECK (fit_score BETWEEN 1 AND 4),
    ai_processing_status TEXT CHECK(ai_processing_status IN ('Queued', 'Processing', 'Completed', 'Failed')) NOT NULL,
    ai_conversation_cache JSONB
);

-- Files table
CREATE TABLE Files (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    content BYTEA,
    uploaded_by INTEGER NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    rfp_id INTEGER NOT NULL,
    FOREIGN KEY (uploaded_by) REFERENCES Users(id),
    FOREIGN KEY (rfp_id) REFERENCES RFPs(id)
);

-- Questions table
CREATE TABLE Questions (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    is_answered BOOLEAN DEFAULT FALSE,
    answer TEXT,
    rfp_id INTEGER NOT NULL,
    answered_by INTEGER,
    answered_at TIMESTAMP WITH TIME ZONE,
    category TEXT CHECK(category IN ('Known', 'Unknown')) NOT NULL,
    FOREIGN KEY (rfp_id) REFERENCES RFPs(id),
    FOREIGN KEY (answered_by) REFERENCES Users(id)
);

-- Comments table
CREATE TABLE Comments (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    rfp_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    related_section TEXT CHECK(related_section IN ('Files', 'Summary', 'Voting', 'Questions', 'Review')) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (rfp_id) REFERENCES RFPs(id)
);

-- Tasks table
CREATE TABLE Tasks (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    assigned_to INTEGER NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    status TEXT CHECK(status IN ('Pending', 'InProgress', 'Completed')) NOT NULL,
    rfp_id INTEGER NOT NULL,
    FOREIGN KEY (assigned_to) REFERENCES Users(id),
    FOREIGN KEY (rfp_id) REFERENCES RFPs(id)
);

-- Milestones table
CREATE TABLE Milestones (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT,
    rfp_id INTEGER NOT NULL,
    FOREIGN KEY (rfp_id) REFERENCES RFPs(id)
);

-- Votes table
CREATE TABLE Votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    rfp_id INTEGER NOT NULL,
    decision TEXT CHECK(decision IN ('Go', 'NoGo')) NOT NULL,
    comments TEXT,
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (rfp_id) REFERENCES RFPs(id)
);

-- Notifications table
CREATE TABLE Notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    type TEXT CHECK(type IN ('Mention', 'Update', 'NewRFP')) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    related_object_type TEXT,
    related_object_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- APIUsage table
CREATE TABLE APIUsage (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    date DATE NOT NULL,
    rfp_count INTEGER DEFAULT 0,
    question_count INTEGER DEFAULT 0,
    total_tokens_used INTEGER DEFAULT 0,
    FOREIGN KEY (company_id) REFERENCES Companies(id)
);

-- Feedback table
CREATE TABLE Feedback (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    allow_sharing BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- User-Company association table
CREATE TABLE UserCompanies (
    user_id INTEGER NOT NULL,
    company_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, company_id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (company_id) REFERENCES Companies(id)
);

-- User-Department association table
CREATE TABLE UserDepartments (
    user_id INTEGER NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, department_id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (department_id) REFERENCES Departments(id)
);

-- RFP Followers table
CREATE TABLE RFPFollowers (
    rfp_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (rfp_id, user_id),
    FOREIGN KEY (rfp_id) REFERENCES RFPs(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Indexes
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_role ON Users(role);
CREATE INDEX idx_companies_name ON Companies(name);
CREATE INDEX idx_subcompanies_parent ON SubCompanies(parent_company_id);
CREATE INDEX idx_departments_parent_company ON Departments(parent_company_id);
CREATE INDEX idx_departments_parent_subcompany ON Departments(parent_sub_company_id);
CREATE INDEX idx_rfps_organization ON RFPs(organization_id, organization_type);
CREATE INDEX idx_rfps_status ON RFPs(status);
CREATE INDEX idx_files_rfp ON Files(rfp_id);
CREATE INDEX idx_questions_rfp ON Questions(rfp_id);
CREATE INDEX idx_comments_rfp ON Comments(rfp_id);
CREATE INDEX idx_tasks_rfp ON Tasks(rfp_id);
CREATE INDEX idx_tasks_assigned_to ON Tasks(assigned_to);
CREATE INDEX idx_milestones_rfp ON Milestones(rfp_id);
CREATE INDEX idx_votes_rfp ON Votes(rfp_id);
CREATE INDEX idx_notifications_user ON Notifications(user_id);
CREATE INDEX idx_apiusage_company ON APIUsage(company_id);
CREATE INDEX idx_feedback_user ON Feedback(user_id);