
Additions and Changes
- The name of this application is MultiRater. MultiRater is a web application designed to facilitate the rating process

Jwt Token when decoded has a payload like this:

```json
{
  "sub": "d1d46d82-8733-4bc8-8ec8-8e1bf276cdef",
  "role": "SUPER_ADMIN",
  "email": "admin@visaya.ai",
  "iat": 1767716548,
  "exp": 1770308548
}
```
- In the Company Management menu there are no details to view all admin users in the company, please add this feature to the company details page in the Company Management menu.

- also add a settings menu in the company admin sidebar. This display will directly change the profile of the company you admin, so you don't need to go to the company profile page again, but directly display the edit company profile form on this settings page.

Bugs:
- It seems that when you log out, you still don't delete cookies, please fix it so that when you log out the cookies are deleted so that when you refresh the page you will be redirected to the login page again, the flicker bug is also still there when you log out and log in again.

Clarify:
- In this application there should be 2 middleware routes, so when accessing /panel it should be directed to the super admin route middleware, and when accessing /backoffice it should be directed to the company admin route middleware, so we can log in on both routes without being disturbed by each other.