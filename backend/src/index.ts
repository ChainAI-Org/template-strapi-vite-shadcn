import WebSocket from 'ws';

// Polyfill global WebSocket if missing (e.g., in some WebContainer Node.js environments)
if (typeof globalThis.WebSocket === 'undefined') {
  (globalThis as any).WebSocket = WebSocket;
  console.log('Polyfilled globalThis.WebSocket with ws package implementation.');
} else {
   console.log('globalThis.WebSocket is already defined. Using existing implementation.');
}

import type { Core } from '@strapi/strapi';

/**
 * Create default admin user if none exists
 */
async function createDefaultAdmin(strapi: Core.Strapi) {
  try {
    const adminService = strapi.admin.services.user;
    const adminCount = await adminService.count();
    
    if (adminCount === 0) {
      const adminEmail = process.env.STRAPI_ADMIN_EMAIL;
      const adminPassword = process.env.STRAPI_ADMIN_PASSWORD;
      const adminFirstName = process.env.STRAPI_ADMIN_FIRSTNAME || 'Admin';
      const adminLastName = process.env.STRAPI_ADMIN_LASTNAME || 'User';
      
      if (adminEmail && adminPassword) {
        const superAdminRole = await strapi.admin.services.role.getSuperAdmin();
        
        await adminService.create({
          email: adminEmail,
          firstname: adminFirstName,
          lastname: adminLastName,
          password: adminPassword,
          isActive: true,
          roles: [superAdminRole.id],
        });
      }
    }
  } catch (error) {
    strapi.log.error('Error creating admin user:', error);
  }
}

/**
 * Enable public find access to the Home API
 */
async function enableHomePublicAccess(strapi: Core.Strapi) {
  try {
    // Find the public role
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });
    
    if (!publicRole) {
      strapi.log.error('Public role not found');
      return;
    }
    
    // Find all permissions for the home API
    const permissions = await strapi.db.query('plugin::users-permissions.permission').findMany({
      where: {
        role: { id: publicRole.id },
        action: { $contains: 'api::home.home.' }
      }
    });
    
    // Find the find action permission
    const findPermission = permissions.find(p => p.action === 'api::home.home.find');
    
    if (findPermission) {
      // Update the existing permission
      if (!findPermission.enabled) {
        await strapi.db.query('plugin::users-permissions.permission').update({
          where: { id: findPermission.id },
          data: { enabled: true }
        });
        strapi.log.info('Enabled find permission for Home API');
      }
    } else {
      // Create a new permission
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::home.home.find',
          role: publicRole.id,
          enabled: true
        }
      });
      strapi.log.info('Created find permission for Home API');
    }
    
    // Force a permissions cache refresh by updating the role's updated_at timestamp
    await strapi.db.query('plugin::users-permissions.role').update({
      where: { id: publicRole.id },
      data: { updated_at: new Date() }
    });
  } catch (error) {
    strapi.log.error('Error enabling Home public access:', error);
  }
}

/**
 * Seed dummy data for the Home API
 */
async function seedHomeData(strapi: Core.Strapi) {
  try {
    const contentType = 'api::home.home';
    
    // Check if content already exists
    const existingHome = await strapi.db.query(contentType).findOne();
    
    if (!existingHome) {
      // Create dummy data
      const homeData = {
        welcome_text: 'Welcome to Our Website',
        subtitle: 'Built with Strapi, Vite, and ShadcnUI',
        content: '## Getting Started\n\nThis is a sample home page created during the bootstrap process.\n\nYou can edit this content in the Strapi admin panel.',
        publishedAt: new Date(),
      };
      
      // Create the content
      await strapi.db.query(contentType).create({
        data: homeData,
      });
    }
  } catch (error) {
    strapi.log.error('Error seeding Home data:', error);
  }
}

export default {
  register({ strapi }: { strapi: Core.Strapi }) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await createDefaultAdmin(strapi);
    await enableHomePublicAccess(strapi);
    await seedHomeData(strapi);
  },
};
