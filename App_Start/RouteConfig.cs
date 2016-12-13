using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Routing;
using Microsoft.AspNet.FriendlyUrls;

namespace GHSP.WebAdmin
{
    public static class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            var settings = new FriendlyUrlSettings();
            // See http://stackoverflow.com/questions/32663858/jquery-ajax-calls-not-working-with-asp-net-web-forms-when-friendlyurls-are-added
            settings.AutoRedirectMode = RedirectMode.Permanent;
            //settings.AutoRedirectMode = RedirectMode..Off;
            routes.EnableFriendlyUrls(settings);
        }
    }
}
