﻿using Microsoft.AspNetCore.Mvc;

using FxSyncNet;
using FxSyncNet.Models;
using BookmarkBrowserAPI.Models;
using BookmarkBrowserAPI.Util;

namespace BookmarkBrowserAPI.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        #region Controller methods
        [HttpGet("login")]
        public IActionResult Login([FromHeader(Name = "authorization")] string authHeader, [FromQuery] string reason = "login")
        {
            if (authHeader is null)
            {
                return BadRequest("Missing authentication information");
            }

            var creds = AuthHelpers.GetAutenticationCredentials(authHeader);

            if (creds is null)
            {
                return BadRequest("Missing authentication information");
            }

            var user = AuthHelpers.GetUser(creds.Username);

            if (user is null)
            {
                return Unauthorized("Authentication failed");
            }

            if (!AuthHelpers.ValidUser(user, creds))
            {
                return Unauthorized("Authentication failed");
            }

            SyncClient syncClient = new SyncClient();
            LoginResponse loginResponse = syncClient.Login(creds.Username, creds.Password, reason);

            return Ok(loginResponse);
        }

        [HttpPost("verify")]
        public IActionResult Verify([FromBody] LoginVerification verification)
        {
            SyncClient syncClient = new SyncClient();

            try
            {
                syncClient.Verify(verification.UserId, verification.VerificationCode);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        #endregion
    }
}
