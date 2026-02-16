# Firebase Setup Guide for iJerdTopup

## Firestore Security Rules

The `firestore.rules` file contains security rules for your Firestore database. Here's how to set it up:

### Rules Overview

1. **Games Collection**
   - ✅ Anyone can READ active games (`active == true`)
   - ✅ Admins can READ all games (including inactive)
   - 🔒 Only Admins can CREATE, UPDATE, or DELETE games

2. **Orders Collection**
   - ✅ Anyone authenticated can CREATE orders
   - 🔒 Only Admins can READ, UPDATE, or DELETE orders

### Setting Up Admin Users

You have two options to mark users as admins:

#### Option 1: Custom Claims (Recommended)

Set custom claims using Firebase Admin SDK:

```javascript
// Using Firebase Admin SDK (Node.js)
const admin = require('firebase-admin');

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('User marked as admin');
  });
```

#### Option 2: Users Collection

Store admin status in Firestore `users` collection:

```javascript
// In Firestore
users/{userId} {
  admin: true,
  email: "admin@example.com"
}
```

Then uncomment the alternative `isAdmin()` function in `firestore.rules`.

### Deploying Rules

1. **Using Firebase CLI:**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Using Firebase Console:**
   - Go to Firebase Console → Firestore Database → Rules
   - Copy and paste the contents of `firestore.rules`
   - Click "Publish"

### Testing Rules

Use the Firebase Console Rules Playground to test your rules before deploying.

### Important Notes

- Rules are evaluated from top to bottom
- The first matching rule wins
- Default deny: All other collections are denied by default
- Validation: The rules include data validation for games and orders

### Security Best Practices

1. ✅ Always validate data structure in rules
2. ✅ Use custom claims for admin roles (more secure)
3. ✅ Test rules thoroughly before deploying
4. ✅ Review rules regularly for security updates
5. ✅ Use the least privilege principle
