# amqp-node

### Oauth 2.0 flow
![Alt text](oauth2-flow.png)

## Oauth 2.0 Authorization Server

## Token management
- Each Access Token will be valid in 1 hour since created.
  - After the user refreshed their token, the old one will be moved to blacklist.
  - If the user wants to access with the old token, they would be rejected.
- Each Refresh Token will be valid in 30 days since created.
  - Depends on the business, the system will generate new RT and send back to the user after refreshed Token.

### TODO
- [ ] Implement blacklist tokens @jimmy @david
- [ ] Implement Logger #log #winston @jimmy @david
- [ ] Install ELK server #log @david
- [ ] CRUD: User @jimmy
- [ ] CRUD: Client @jimmy
- [ ] Profile: Change password @jimmy
- [ ] Authenticate: Reset password @jimmy
- [ ] Authorization Flow @jimmy
- [ ] Update / Edit OAuth application @jimmy
- [ ] Remove OAuth application @jimmy
- [ ] Rate limit for api call @jimmy

### Completed features ✓
- [x] Authorize of OAuth
  - response_type
  - client_id
- [x] Get token and refresh token from OAuth @jimmy
- [x] Refresh Token of OAuth @jimmy
- [x] Register User @jimmy
- [x] Login User into system @jimmy
- [x] Refresh User Token @jimmy
- [x] Create OAuth Application @jimmy