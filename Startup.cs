using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(GHSP.WebAdmin.Startup))]
namespace GHSP.WebAdmin
{
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);
        }
    }
}
