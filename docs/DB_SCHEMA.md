# Database Schema - Sylo-core

## Overview

Sylo-core uses a PostgreSQL database (NeonDB) with a normalized relational schema designed for multi-tenancy, scalability, and design studio workflows. The schema supports complex project hierarchies, task dependencies, supplier management, and comprehensive audit trails.

## Core Principles

- **Multi-tenancy**: Firm-level data isolation with shared infrastructure
- **Audit Trail**: Complete change history for all critical entities
- **Soft Deletes**: Preserve data integrity for reporting and recovery
- **Performance**: Optimized indexes and query patterns
- **Extensibility**: Schema designed for future feature additions

## Entity Relationship Diagram

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│    Firms    │◄────►│    Users    │      │   Clients   │
│             │ 1:N  │             │      │             │
│ - id        │      │ - id        │      │ - id        │
│ - name      │      │ - firm_id   │      │ - firm_id   │
│ - tier      │      │ - email     │      │ - name      │
└─────────────┘      │ - role      │      │ - email     │
                     └─────────────┘      │ - company   │
                                          └──────┬──────┘
                                                 │ 1:N
                                          ┌──────▼──────┐
                                          │  Projects   │
                                          │             │
                                          │ - id        │
                                          │ - client_id │
                                          │ - name      │
                                          │ - type      │
                                          │ - stage     │
                                          │ - budget    │
                                          └──────┬──────┘
                                                 │ 1:N
                              ┌──────────────────┼──────────────────┐
                              │                  │                  │
                       ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐
                       │    Tasks    │   │ Milestones  │   │   Files     │
                       │             │   │             │   │             │
                       │ - id        │   │ - id        │   │ - id        │
                       │ - parent_id │   │ - name      │   │ - name      │
                       │ - title     │   │ - due_date  │   │ - url       │
                       │ - status    │   │ - stage     │   │ - type      │
                       │ - priority  │   └─────────────┘   └─────────────┘
                       └─────────────┘
```

## Core Tables

### 1. Firms Table

```sql
CREATE TABLE firms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    subscription_tier VARCHAR(50) DEFAULT 'pro',
    subscription_status VARCHAR(50) DEFAULT 'active',
    billing_email VARCHAR(255),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_firms_slug ON firms(slug);
CREATE INDEX idx_firms_subscription_tier ON firms(subscription_tier);
```

### 2. Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID REFERENCES firms(id) NOT NULL,
    supabase_user_id UUID UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'designer', -- 'admin', 'designer', 'client'
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    last_active_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_users_firm_id ON users(firm_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_supabase_id ON users(supabase_user_id);
CREATE INDEX idx_users_role ON users(role);
```

### 3. Clients Table

```sql
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID REFERENCES firms(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    address JSONB, -- {street, city, state, zip, country}
    contact_person VARCHAR(255),
    xero_contact_id VARCHAR(255),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'prospect'
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_clients_firm_id ON clients(firm_id);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_created_by ON clients(created_by);
```

### 4. Projects Table

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID REFERENCES firms(id) NOT NULL,
    client_id UUID REFERENCES clients(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100) NOT NULL, -- 'interior', 'architecture', 'branding', 'web'
    current_stage VARCHAR(50) DEFAULT 'stage_0',
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'on_hold', 'completed', 'cancelled'
    budget DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'USD',
    timeline_start DATE,
    timeline_end DATE,
    actual_start DATE,
    actual_end DATE,
    project_manager_id UUID REFERENCES users(id),
    settings JSONB DEFAULT '{}', -- project-specific settings
    metadata JSONB DEFAULT '{}', -- additional project data
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_projects_firm_id ON projects(firm_id);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_stage ON projects(current_stage);
CREATE INDEX idx_projects_manager ON projects(project_manager_id);
CREATE INDEX idx_projects_timeline ON projects(timeline_start, timeline_end);
```

### 5. Tasks Table

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) NOT NULL,
    parent_task_id UUID REFERENCES tasks(id), -- for subtasks
    title VARCHAR(255) NOT NULL,
    description TEXT,
    stage VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'client_review', 'complete', 'blocked'
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    due_date TIMESTAMP WITH TIME ZONE,
    start_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2) DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    assignee_id UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    tags VARCHAR(255)[], -- array of tags
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_parent_id ON tasks(parent_task_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_stage ON tasks(stage);
CREATE INDEX idx_tasks_tags ON tasks USING GIN(tags);
```

### 6. Task Dependencies Table

```sql
CREATE TABLE task_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    predecessor_id UUID REFERENCES tasks(id) NOT NULL,
    successor_id UUID REFERENCES tasks(id) NOT NULL,
    dependency_type VARCHAR(50) DEFAULT 'finish_to_start', -- 'finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish'
    lag_hours INTEGER DEFAULT 0, -- hours delay after predecessor
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(predecessor_id, successor_id)
);

-- Indexes
CREATE INDEX idx_task_deps_predecessor ON task_dependencies(predecessor_id);
CREATE INDEX idx_task_deps_successor ON task_dependencies(successor_id);
```

## Project Management Tables

### 7. Milestones Table

```sql
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    stage VARCHAR(50),
    is_critical BOOLEAN DEFAULT false,
    deliverables TEXT[],
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_milestones_project_id ON milestones(project_id);
CREATE INDEX idx_milestones_due_date ON milestones(due_date);
CREATE INDEX idx_milestones_stage ON milestones(stage);
```

### 8. Comments Table

```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL, -- 'task', 'project', 'milestone'
    entity_id UUID NOT NULL,
    parent_comment_id UUID REFERENCES comments(id), -- for threaded comments
    content TEXT NOT NULL,
    content_type VARCHAR(20) DEFAULT 'text', -- 'text', 'markdown'
    mentions UUID[], -- array of user IDs mentioned
    attachments JSONB DEFAULT '[]', -- array of file references
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX idx_comments_created_by ON comments(created_by);
CREATE INDEX idx_comments_mentions ON comments USING GIN(mentions);
```

### 9. Files Table

```sql
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID REFERENCES firms(id) NOT NULL,
    project_id UUID REFERENCES projects(id),
    task_id UUID REFERENCES tasks(id),
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    mime_type VARCHAR(255),
    storage_provider VARCHAR(50) DEFAULT 'vercel_blob',
    storage_url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_public BOOLEAN DEFAULT false,
    uploaded_by UUID REFERENCES users(id),
    metadata JSONB DEFAULT '{}', -- dimensions, duration, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_files_firm_id ON files(firm_id);
CREATE INDEX idx_files_project_id ON files(project_id);
CREATE INDEX idx_files_task_id ON files(task_id);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX idx_files_type ON files(file_type);
```

## Supplier & Product Management Tables

### 10. Suppliers Table

```sql
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID REFERENCES firms(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    website TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address JSONB,
    specialty VARCHAR(255), -- 'lighting', 'furniture', 'textiles', etc.
    lead_time_days INTEGER,
    payment_terms VARCHAR(100),
    notes TEXT,
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    is_preferred BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_suppliers_firm_id ON suppliers(firm_id);
CREATE INDEX idx_suppliers_specialty ON suppliers(specialty);
CREATE INDEX idx_suppliers_preferred ON suppliers(is_preferred);
```

### 11. Products Table

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID REFERENCES firms(id) NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100),
    category VARCHAR(100), -- 'lighting', 'furniture', 'fabrics', 'finishes', 'hardware', 'accessories'
    subcategory VARCHAR(100),
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    dimensions JSONB, -- {width, height, depth, diameter, etc.}
    materials VARCHAR(255)[],
    colors VARCHAR(255)[],
    finishes VARCHAR(255)[],
    styles VARCHAR(255)[], -- 'modern', 'traditional', 'industrial', etc.
    source_url TEXT,
    images JSONB DEFAULT '[]', -- array of image URLs
    specifications JSONB DEFAULT '{}',
    availability_status VARCHAR(50) DEFAULT 'available',
    lead_time_weeks INTEGER,
    min_order_quantity INTEGER DEFAULT 1,
    ai_tags VARCHAR(255)[], -- AI-generated tags
    ai_color_palette JSONB, -- extracted color information
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_products_firm_id ON products(firm_id);
CREATE INDEX idx_products_supplier_id ON products(supplier_id);
CREATE INDEX idx_products_category ON products(category, subcategory);
CREATE INDEX idx_products_materials ON products USING GIN(materials);
CREATE INDEX idx_products_colors ON products USING GIN(colors);
CREATE INDEX idx_products_styles ON products USING GIN(styles);
CREATE INDEX idx_products_tags ON products USING GIN(ai_tags);
CREATE INDEX idx_products_price ON products(price);
```

### 12. Project Products Table

```sql
CREATE TABLE project_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'selected', -- 'selected', 'ordered', 'delivered', 'installed'
    notes TEXT,
    room_location VARCHAR(255),
    added_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(project_id, product_id)
);

-- Indexes
CREATE INDEX idx_project_products_project ON project_products(project_id);
CREATE INDEX idx_project_products_product ON project_products(product_id);
CREATE INDEX idx_project_products_status ON project_products(status);
```

## Integration & System Tables

### 13. Integrations Table

```sql
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID REFERENCES firms(id) NOT NULL,
    service_name VARCHAR(100) NOT NULL, -- 'google', 'xero', 'runway', etc.
    service_type VARCHAR(50) NOT NULL, -- 'calendar', 'accounting', 'video', etc.
    is_active BOOLEAN DEFAULT true,
    credentials JSONB, -- encrypted API keys, tokens, etc.
    settings JSONB DEFAULT '{}',
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(50) DEFAULT 'connected',
    error_message TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_integrations_firm_id ON integrations(firm_id);
CREATE INDEX idx_integrations_service ON integrations(service_name, service_type);
CREATE INDEX idx_integrations_status ON integrations(sync_status);
```

### 14. Chat History Table

```sql
CREATE TABLE chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    session_id UUID NOT NULL,
    message_type VARCHAR(20) NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    intent VARCHAR(100),
    entities JSONB,
    context JSONB DEFAULT '{}',
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_session ON chat_history(session_id);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at);
```

### 15. Audit Log Table

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_values JSONB,
    new_values JSONB,
    changed_fields VARCHAR(255)[],
    user_id UUID REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

## Views and Functions

### 16. Project Summary View

```sql
CREATE VIEW project_summary AS
SELECT 
    p.id,
    p.name,
    p.type,
    p.current_stage,
    p.status,
    p.budget,
    c.name as client_name,
    u.first_name || ' ' || u.last_name as project_manager,
    COUNT(t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'complete' THEN 1 END) as completed_tasks,
    ROUND(
        (COUNT(CASE WHEN t.status = 'complete' THEN 1 END)::float / 
         NULLIF(COUNT(t.id), 0)) * 100, 2
    ) as completion_percentage,
    p.timeline_start,
    p.timeline_end,
    p.created_at
FROM projects p
LEFT JOIN clients c ON p.client_id = c.id
LEFT JOIN users u ON p.project_manager_id = u.id
LEFT JOIN tasks t ON p.id = t.project_id AND t.deleted_at IS NULL
WHERE p.deleted_at IS NULL
GROUP BY p.id, c.name, u.first_name, u.last_name;
```

### 17. Update Timestamp Function

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at column
CREATE TRIGGER update_firms_updated_at BEFORE UPDATE ON firms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add triggers for other tables as needed
```

## Performance Considerations

### Indexing Strategy
- Primary keys and foreign keys are automatically indexed
- Composite indexes for common query patterns
- GIN indexes for array and JSONB columns
- Partial indexes for soft-deleted records

### Query Optimization
- Use of materialized views for complex analytics
- Connection pooling with NeonDB
- Read replicas for reporting queries
- Proper use of EXPLAIN ANALYZE for query optimization

### Data Retention
- Soft deletes preserve referential integrity
- Automated cleanup of old chat history (>6 months)
- Compressed storage for old audit logs
- Regular VACUUM and ANALYZE operations

## Migration Strategy

### Development Workflow
1. Create migration files using Prisma
2. Test migrations on development branch database
3. Review and approve schema changes
4. Deploy to staging environment
5. Run production migration during maintenance window

### Backup Strategy
- Automated daily backups with NeonDB
- Point-in-time recovery capability
- Cross-region backup replication
- Regular restore testing procedures

## Seed Data Examples

### Initial Setup Data

```sql
-- Example seed data for development and testing

-- Insert sample firm
INSERT INTO firms (id, name, slug, subscription_tier, subscription_status, billing_email) VALUES
('firm_sample_01', 'Stellar Design Studio', 'stellar-design', 'pro', 'active', 'billing@stellardesign.com');

-- Insert sample users
INSERT INTO users (id, firm_id, email, first_name, last_name, role) VALUES
('user_admin_01', 'firm_sample_01', 'sarah@stellardesign.com', 'Sarah', 'Chen', 'admin'),
('user_designer_01', 'firm_sample_01', 'marcus@stellardesign.com', 'Marcus', 'Rodriguez', 'designer'),
('user_pm_01', 'firm_sample_01', 'emma@stellardesign.com', 'Emma', 'Thompson', 'project_manager');

-- Insert sample clients
INSERT INTO clients (id, firm_id, name, email, phone, company, status, created_by) VALUES
('client_01', 'firm_sample_01', 'Jennifer Davis', 'jennifer@davisholdings.com', '+1-555-0123', 'Davis Holdings', 'active', 'user_admin_01'),
('client_02', 'firm_sample_01', 'Thompson Family', 'contact@thompsonfamily.com', '+1-555-0456', 'Thompson Residence', 'active', 'user_admin_01');

-- Insert sample suppliers
INSERT INTO suppliers (id, firm_id, name, website, contact_email, specialty, lead_time_days, is_preferred, created_by) VALUES
('supplier_01', 'firm_sample_01', 'Restoration Hardware', 'https://rh.com', 'trade@rh.com', 'furniture', 84, true, 'user_admin_01'),
('supplier_02', 'firm_sample_01', 'West Elm Contract', 'https://westelm.com/contract', 'contract@westelm.com', 'furniture', 56, true, 'user_admin_01'),
('supplier_03', 'firm_sample_01', 'Artemide Lighting', 'https://artemide.com', 'orders@artemide.com', 'lighting', 42, false, 'user_designer_01');

-- Insert sample products
INSERT INTO products (id, firm_id, supplier_id, name, description, category, subcategory, price, currency, materials, colors, styles, created_by) VALUES
('product_01', 'firm_sample_01', 'supplier_01', 'Salvaged Wood Trestle Table', 'Handcrafted dining table from reclaimed oak with industrial metal base', 'furniture', 'dining_tables', 2400.00, 'USD', ARRAY['reclaimed_oak', 'steel'], ARRAY['#8B4513', '#2F2F2F'], ARRAY['industrial', 'rustic', 'modern'], 'user_designer_01'),
('product_02', 'firm_sample_01', 'supplier_02', 'Anton Solid Wood Dining Table', 'Contemporary dining table in solid mango wood with hairpin legs', 'furniture', 'dining_tables', 1200.00, 'USD', ARRAY['mango_wood', 'steel'], ARRAY['#DEB887', '#1C1C1C'], ARRAY['modern', 'minimalist'], 'user_designer_01'),
('product_03', 'firm_sample_01', 'supplier_03', 'Tolomeo Table Lamp', 'Iconic adjustable desk lamp with aluminum finish', 'lighting', 'task_lighting', 450.00, 'USD', ARRAY['aluminum', 'steel'], ARRAY['#C0C0C0'], ARRAY['modern', 'industrial'], 'user_designer_01');

-- Insert sample projects
INSERT INTO projects (id, firm_id, client_id, name, description, type, current_stage, budget, currency, timeline_start, timeline_end, project_manager_id, created_by) VALUES
('project_01', 'firm_sample_01', 'client_01', 'Modern Loft Renovation', 'Complete renovation of 2,500 sq ft industrial loft into contemporary living space', 'interior', 'stage_2', 75000.00, 'USD', '2025-06-01', '2025-09-30', 'user_pm_01', 'user_admin_01'),
('project_02', 'firm_sample_01', 'client_02', 'Thompson Family Home', 'New construction interior design for 4,000 sq ft family home', 'interior', 'stage_1', 120000.00, 'USD', '2025-07-15', '2025-12-20', 'user_pm_01', 'user_admin_01');

-- Insert sample tasks
INSERT INTO tasks (id, project_id, title, description, stage, status, priority, due_date, estimated_hours, assignee_id, created_by) VALUES
('task_01', 'project_01', 'Complete space planning layouts', 'Finalize furniture layouts for living, dining, and bedroom areas', 'stage_2', 'in_progress', 'high', '2025-06-15 17:00:00+00', 16.0, 'user_designer_01', 'user_pm_01'),
('task_02', 'project_01', 'Source dining room furniture', 'Research and present 3 dining table options within budget', 'stage_2', 'pending', 'medium', '2025-06-20 17:00:00+00', 8.0, 'user_designer_01', 'user_pm_01'),
('task_03', 'project_02', 'Initial client briefing meeting', 'Gather requirements, preferences, and establish design direction', 'stage_1', 'complete', 'high', '2025-06-10 17:00:00+00', 4.0, 'user_pm_01', 'user_admin_01');

-- Insert sample milestones
INSERT INTO milestones (id, project_id, name, description, due_date, stage, is_critical, deliverables, created_by) VALUES
('milestone_01', 'project_01', 'Design Development Complete', 'All spatial layouts, material selections, and specifications finalized', '2025-07-15', 'stage_2', true, ARRAY['Floor plans', 'Material boards', 'Furniture specifications'], 'user_pm_01'),
('milestone_02', 'project_02', 'Concept Presentation', 'Present initial design concepts and mood boards to client', '2025-08-01', 'stage_1', false, ARRAY['Mood boards', 'Concept sketches', 'Material samples'], 'user_pm_01');

-- Insert sample project products
INSERT INTO project_products (id, project_id, product_id, quantity, unit_price, total_price, status, room_location, added_by) VALUES
('pp_01', 'project_01', 'product_01', 1, 2400.00, 2400.00, 'selected', 'dining_room', 'user_designer_01'),
('pp_02', 'project_01', 'product_03', 2, 450.00, 900.00, 'selected', 'living_room', 'user_designer_01');
```

### Development Testing Queries

```sql
-- Verify seed data was inserted correctly
SELECT 
    f.name as firm_name,
    COUNT(DISTINCT u.id) as user_count,
    COUNT(DISTINCT c.id) as client_count,
    COUNT(DISTINCT p.id) as project_count,
    COUNT(DISTINCT t.id) as task_count
FROM firms f
LEFT JOIN users u ON f.id = u.firm_id
LEFT JOIN clients c ON f.id = c.firm_id  
LEFT JOIN projects p ON f.id = p.firm_id
LEFT JOIN tasks t ON p.id = t.project_id
WHERE f.id = 'firm_sample_01'
GROUP BY f.id, f.name;

-- Check project health metrics
SELECT 
    p.name as project_name,
    p.current_stage,
    COUNT(t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'complete' THEN 1 END) as completed_tasks,
    ROUND(
        (COUNT(CASE WHEN t.status = 'complete' THEN 1 END)::float / 
         NULLIF(COUNT(t.id), 0)) * 100, 1
    ) as completion_percentage,
    SUM(t.estimated_hours) as total_estimated_hours
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
WHERE p.firm_id = 'firm_sample_01'
GROUP BY p.id, p.name, p.current_stage;
```

## Performance Considerations