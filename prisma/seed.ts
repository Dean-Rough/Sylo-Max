import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create a firm first
  const firm = await prisma.firm.create({
    data: {
      name: 'Design Studio Pro',
      slug: 'design-studio-pro',
      subscriptionTier: 'pro',
      subscriptionStatus: 'active',
      billingEmail: 'billing@designstudio.com',
      settings: {
        theme: 'light',
        notifications: true,
        timezone: 'UTC'
      }
    }
  })

  console.log('✅ Created firm:', firm.name)

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        firmId: firm.id,
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
        preferences: {
          theme: 'light',
          notifications: true
        }
      }
    }),
    prisma.user.create({
      data: {
        firmId: firm.id,
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'designer',
        preferences: {
          theme: 'dark',
          notifications: true
        }
      }
    }),
    prisma.user.create({
      data: {
        firmId: firm.id,
        email: 'mike.wilson@example.com',
        firstName: 'Mike',
        lastName: 'Wilson',
        role: 'project_manager',
        preferences: {
          theme: 'light',
          notifications: false
        }
      }
    })
  ])

  console.log('✅ Created users:', users.length)

  // Create clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        firmId: firm.id,
        name: 'Tech Innovations Inc',
        email: 'contact@techinnovations.com',
        phone: '+1-555-0123',
        company: 'Tech Innovations Inc',
        contactPerson: 'Sarah Johnson',
        status: 'active',
        createdBy: users[0].id,
        address: {
          street: '123 Innovation Drive',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          country: 'USA'
        }
      }
    }),
    prisma.client.create({
      data: {
        firmId: firm.id,
        name: 'Green Earth Solutions',
        email: 'hello@greenearthsolutions.com',
        phone: '+1-555-0456',
        company: 'Green Earth Solutions',
        contactPerson: 'David Chen',
        status: 'active',
        createdBy: users[1].id,
        address: {
          street: '456 Eco Street',
          city: 'Portland',
          state: 'OR',
          zip: '97201',
          country: 'USA'
        }
      }
    }),
    prisma.client.create({
      data: {
        firmId: firm.id,
        name: 'Urban Living Co',
        email: 'projects@urbanliving.com',
        phone: '+1-555-0789',
        company: 'Urban Living Co',
        contactPerson: 'Emily Rodriguez',
        status: 'active',
        createdBy: users[2].id,
        address: {
          street: '789 City Plaza',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'USA'
        }
      }
    })
  ])

  console.log('✅ Created clients:', clients.length)

  // Create projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        firmId: firm.id,
        clientId: clients[0].id,
        name: 'Modern Office Redesign',
        description: 'Complete renovation of Tech Innovations headquarters including open workspace design, meeting rooms, and collaborative spaces.',
        type: 'Commercial Interior',
        currentStage: 'stage_2',
        status: 'active',
        budget: 250000.00,
        currency: 'USD',
        timelineStart: new Date('2024-01-15'),
        timelineEnd: new Date('2024-06-30'),
        actualStart: new Date('2024-01-20'),
        projectManagerId: users[2].id,
        createdBy: users[0].id,
        settings: {
          allowClientAccess: true,
          requireApprovals: true
        }
      }
    }),
    prisma.project.create({
      data: {
        firmId: firm.id,
        clientId: clients[1].id,
        name: 'Sustainable Retail Space',
        description: 'Eco-friendly retail store design focusing on sustainable materials and energy-efficient lighting solutions.',
        type: 'Retail Design',
        currentStage: 'stage_1',
        status: 'active',
        budget: 180000.00,
        currency: 'USD',
        timelineStart: new Date('2024-02-01'),
        timelineEnd: new Date('2024-08-15'),
        actualStart: new Date('2024-02-05'),
        projectManagerId: users[1].id,
        createdBy: users[1].id,
        settings: {
          allowClientAccess: true,
          requireApprovals: false
        }
      }
    }),
    prisma.project.create({
      data: {
        firmId: firm.id,
        clientId: clients[2].id,
        name: 'Luxury Apartment Complex',
        description: 'High-end residential interior design for 50-unit luxury apartment complex including common areas and model units.',
        type: 'Residential',
        currentStage: 'stage_0',
        status: 'planning',
        budget: 500000.00,
        currency: 'USD',
        timelineStart: new Date('2024-03-01'),
        timelineEnd: new Date('2024-12-31'),
        projectManagerId: users[2].id,
        createdBy: users[0].id,
        settings: {
          allowClientAccess: false,
          requireApprovals: true
        }
      }
    })
  ])

  console.log('✅ Created projects:', projects.length)

  // Create tasks with various due dates and statuses
  const tasks = await Promise.all([
    // Tasks for Modern Office Redesign (overdue)
    prisma.task.create({
      data: {
        projectId: projects[0].id,
        title: 'Initial Client Meeting',
        description: 'Meet with client to understand requirements and vision',
        stage: 'stage_0',
        status: 'completed',
        priority: 'high',
        dueDate: new Date('2024-01-10'),
        startDate: new Date('2024-01-05'),
        completedAt: new Date('2024-01-08'),
        estimatedHours: 4.0,
        actualHours: 3.5,
        progressPercentage: 100,
        assigneeId: users[2].id,
        createdBy: users[0].id,
        tags: ['meeting', 'client', 'planning']
      }
    }),
    prisma.task.create({
      data: {
        projectId: projects[0].id,
        title: 'Space Planning & Layout',
        description: 'Create initial space plans and layout options',
        stage: 'stage_1',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date('2024-06-01'), // Due soon
        startDate: new Date('2024-05-15'),
        estimatedHours: 24.0,
        actualHours: 16.0,
        progressPercentage: 65,
        assigneeId: users[1].id,
        createdBy: users[2].id,
        tags: ['design', 'planning', 'layout']
      }
    }),
    prisma.task.create({
      data: {
        projectId: projects[0].id,
        title: 'Material Selection',
        description: 'Select and source materials for the project',
        stage: 'stage_2',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date('2024-06-15'),
        estimatedHours: 12.0,
        actualHours: 0.0,
        progressPercentage: 0,
        assigneeId: users[1].id,
        createdBy: users[2].id,
        tags: ['materials', 'sourcing']
      }
    }),
    // Tasks for Sustainable Retail Space
    prisma.task.create({
      data: {
        projectId: projects[1].id,
        title: 'Sustainability Research',
        description: 'Research eco-friendly materials and sustainable design practices',
        stage: 'stage_0',
        status: 'completed',
        priority: 'high',
        dueDate: new Date('2024-02-15'),
        startDate: new Date('2024-02-01'),
        completedAt: new Date('2024-02-12'),
        estimatedHours: 16.0,
        actualHours: 18.0,
        progressPercentage: 100,
        assigneeId: users[1].id,
        createdBy: users[1].id,
        tags: ['research', 'sustainability', 'materials']
      }
    }),
    prisma.task.create({
      data: {
        projectId: projects[1].id,
        title: 'Concept Development',
        description: 'Develop initial design concepts and mood boards',
        stage: 'stage_1',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date('2024-06-10'), // Due soon
        startDate: new Date('2024-05-20'),
        estimatedHours: 20.0,
        actualHours: 8.0,
        progressPercentage: 40,
        assigneeId: users[1].id,
        createdBy: users[1].id,
        tags: ['concept', 'design', 'mood-board']
      }
    }),
    // Tasks for Luxury Apartment Complex (overdue task)
    prisma.task.create({
      data: {
        projectId: projects[2].id,
        title: 'Market Research',
        description: 'Research luxury apartment market trends and competitor analysis',
        stage: 'stage_0',
        status: 'overdue',
        priority: 'medium',
        dueDate: new Date('2024-05-15'), // Overdue
        startDate: new Date('2024-04-01'),
        estimatedHours: 12.0,
        actualHours: 6.0,
        progressPercentage: 30,
        assigneeId: users[0].id,
        createdBy: users[0].id,
        tags: ['research', 'market-analysis', 'luxury']
      }
    })
  ])

  console.log('✅ Created tasks:', tasks.length)

  // Create some milestones
  const milestones = await Promise.all([
    prisma.milestone.create({
      data: {
        projectId: projects[0].id,
        name: 'Design Development Complete',
        description: 'All design concepts finalized and approved by client',
        dueDate: new Date('2024-07-01'),
        stage: 'stage_2',
        isCritical: true,
        deliverables: ['Final space plans', 'Material specifications', 'Lighting design'],
        createdBy: users[2].id
      }
    }),
    prisma.milestone.create({
      data: {
        projectId: projects[1].id,
        name: 'Sustainable Design Approval',
        description: 'Eco-friendly design concepts approved and ready for implementation',
        dueDate: new Date('2024-08-01'),
        stage: 'stage_1',
        isCritical: true,
        deliverables: ['Sustainability report', 'Green material list', 'Energy efficiency plan'],
        createdBy: users[1].id
      }
    })
  ])

  console.log('✅ Created milestones:', milestones.length)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })