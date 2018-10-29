<h1>👋notes (aka slapnotes)</h1>
A basic notepad site inspired by <a href="http://v1k45.com/blog/modern-django-part-1-setting-up-django-and-react/">this awesome tutorial</a> but enhanced with a markdown editor, note titles, a better UI, etc.

Features:
- Token-based authentication
- Markdown editor
- 2 colorschemes + support for more
- Password reset, forgot password functionality
- Mobile responsive

TODO:
- Confirmation/error messages
- Clear error messages
- Fix all mobile styles
- More colorschemes?
- Fix Django settings for production

Scenarios to test:
- Register
	- Success message
- Login/Logout ✓
- Change password page
	- Clear errors on submit
	- Figure out cookies here?
- Change password email
	- Remove api prefix from link in email
	- Figure out what's up with the 401 that gets returned sometimes?
	- See what happens when we're logged in and we go through this vs. when we're not
- Contact email ✓
- Notes
	- Create ✓
	- Update ✓
	- Delete ✓
- Token expiry?
