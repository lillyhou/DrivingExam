using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Threading.Tasks;

namespace AzureAdDemo.Controllers
{
    /// <summary>
    /// Stellt einen Endpunkte
    /// /oauth/login, /oauth/logout und /oauth/me
    /// bereit, die von der Next.js App aufgerufen werden können.
    /// </summary>
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class OauthController : ControllerBase
    {
        //private readonly ILogger<OauthController> _log;
        //public OauthController(ILogger<OauthController> log) => _log = log;

        [HttpGet("login")]
        [AllowAnonymous]
        public IActionResult Login(string? redirectUri = "/")
        {
           // _log.LogInformation("⌨️  /oauth/login called. redirectUri={Redirect}", redirectUri);
            return Challenge(new AuthenticationProperties
            {
                RedirectUri = redirectUri
            }, OpenIdConnectDefaults.AuthenticationScheme);
        }
        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            //_log.LogInformation("👋  /oauth/logout called by {User}", User.Identity?.Name ?? "anonymous");
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignOutAsync(OpenIdConnectDefaults.AuthenticationScheme);
            return NoContent();
        }


        /// <summary>
        /// Endpunkt für GET /oauth/me
        /// </summary>
        [HttpGet("me")]
        public IActionResult GetUserDetails()
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
            var firstname = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.GivenName)?.Value;
            var lastname = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Surname)?.Value;

            //_log.LogInformation("🔎  /oauth/me called. Authenticated={Auth}",
                          // HttpContext.User.Identity?.IsAuthenticated ?? false);
            return Ok(new
            {
                firstname,
                lastname,
                Username = HttpContext.User.Identity?.Name,
                IsAdmin = HttpContext.User.IsInRole("admin"),
            });
        }
    }
}
