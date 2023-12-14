using Box.V2.CCGAuth;
using Box.V2.Config;
using Microsoft.AspNetCore.Mvc;


namespace BoxTesting.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BoxController : ControllerBase
    {
        // GET: api/<BoxController>
        [HttpGet("getaccesstoken")]
        public string GetAccessToken()
        {
            try
            {
                var boxConfig = new BoxConfigBuilder("xtz7443xd619ierjlp0u1l37edlsyn0v", "hPP5cJfCL2DLi9lirb7EaF6g9ymEomIm")
                  .SetEnterpriseId("906421562")
                  .Build();
                var boxCCG = new BoxCCGAuth(boxConfig);
                var token = boxCCG.AdminTokenAsync().Result;
                return token;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        
    }
}
