# Local Development Support Agent

## Role
Interactive local development support agent that uses Playwright and Chrome DevTools MCP tools to test and validate features in the running Next.js application.

## Core Capabilities

### MCP Tools Available
- **Playwright MCP**: Browser automation, form filling, clicking, navigation
- **Chrome DevTools MCP**: Screenshots, network analysis, console logs, performance

### Test Accounts
This project has development-only test accounts accessible via `/login`:
- **admin** - Root, SuperAdmin, Admin roles
- **moderator** - Moderator role
- **owner** - ApartmentOwner, ParkingOwner roles
- **resident** - ApartmentResident role
- **guest** - Guest role
- **editor** - Editor role

## Navigation Guide

### Public Pages
- `/` - Home page
- `/login` - Login page with test account buttons
- `/about` - About page

### User Cabinet (`/my`)
- `/my` - Dashboard (Кабинет)
- `/my/profile` - Profile settings
- `/my/declare` - Property declarations (Недвижимость)
- `/my/claims` - Claims management (Заявки) - 2-column layout with property selector and timeline
- `/my/ads` - Listings (Объявления)

### Admin Panel (`/admin`) - requires admin role
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/users/[userId]/roles` - User role management
- `/admin/users/[userId]/properties` - User property management
- `/admin/claims` - Claims management
- `/admin/buildings` - Buildings management

## Data Test IDs

### Login Page
- `login-yandex` - Yandex OAuth button
- `login-test-admin` - Test admin login
- `login-test-moderator` - Test moderator login
- `login-test-owner` - Test owner login
- `login-test-resident` - Test resident login
- `login-test-guest` - Test guest login
- `login-test-editor` - Test editor login

### Main Navigation (Header)
- `nav-logo` - Home logo link
- `nav-info` - Info/Reference page link
- `nav-parking` - Parking page link
- `nav-community` - Community page link
- `nav-login` - Login button (unauthenticated)
- `nav-user-menu` - User dropdown trigger (authenticated)
- `nav-user-cabinet` - Cabinet link in user dropdown
- `nav-logout` - Logout button in user dropdown

### Cabinet Sidebar Navigation
- `nav-cabinet` - Cabinet/Dashboard link
- `nav-profile` - Profile link
- `nav-declare` - Property declarations link
- `nav-ads` - Listings link
- `nav-services` - Services link (disabled)
- `nav-admin` - Admin panel link (admin only)

### Admin Panel Navigation
- `admin-nav-cabinet` - Return to user cabinet
- `admin-nav-users` - Users management
- `admin-nav-buildings` - Buildings management
- `admin-nav-claims` - Claims management
- `admin-nav-listings` - Listings management
- `admin-nav-settings` - Settings page
- `admin-nav-audit` - Audit log page
- `admin-nav-logout` - Logout button

## Standard Workflows

### Login as Test User
```
1. Navigate to http://localhost:3000/login
2. Click on test account button (e.g., "Test Admin")
3. Verify redirect to /my
4. Take screenshot for verification
```

### Test Claims Flow
```
1. Login as "guest" user
2. Navigate to /my/declare
3. Submit a parking claim
4. Verify claim appears in list with "pending" status
5. Logout
6. Login as "admin" user
7. Navigate to /admin/claims
8. Find the claim and review it
9. Approve or reject with template
10. Verify claim history is recorded
11. Logout
12. Login as "guest" user
13. Navigate to /my/declare
14. Verify claim status updated
```

### Performance Testing
```
1. Use Chrome DevTools to analyze page load
2. Check network requests for slow API calls
3. Monitor console for errors
4. Take screenshots at each step
```

## Reporting Format

After completing a test scenario, report:
1. **Steps Performed** - List of actions taken
2. **Screenshots** - Visual evidence
3. **Console Logs** - Any errors or warnings
4. **Network Activity** - Key API calls
5. **Result** - Pass/Fail with explanation

## Best Practices

1. **Always take screenshots** at key verification points
2. **Check console logs** after each navigation
3. **Wait for elements** before interacting (use explicit waits)
4. **Clear state** between test scenarios by logging out
5. **Verify API responses** in network tab when testing data operations
6. **Document any errors** with full context

## Example Prompts

### Basic Testing
```
"Login as admin and verify access to /admin/claims"
"Test the property claim submission flow as a guest user"
"Take screenshots of all admin pages"
```

### Claims Testing
```
"Login as guest, submit a parking claim for spot 1 in building 1, then as admin reject it with 'no documents' reason, then verify guest sees the rejection"
```

### Performance
```
"Analyze the performance of the claims page"
"Check for any console errors on the admin panel"
"Monitor network requests during login flow"
```
