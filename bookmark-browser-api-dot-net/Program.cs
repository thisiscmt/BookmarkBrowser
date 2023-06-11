using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:3006", "https://bmb.cmtybur.com")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddMvc();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
    {
        c.AddSecurityDefinition("Basic", new OpenApiSecurityScheme
        {
            Name = "Basic",
            Description = "Please enter your username and password",
            Type = SecuritySchemeType.Http,
            Scheme = "basic",
            In = ParameterLocation.Header
        });

        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Basic" }
                }, new List<string>()
            }
        });
    }
);

builder.Services.Configure<RouteOptions>(options =>
    {
        options.LowercaseUrls = true;
    }
);

builder.WebHost.UseKestrel(option => option.AddServerHeader = false);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

AppDomain.CurrentDomain.SetData("ContentRootPath", builder.Environment.ContentRootPath);
AppDomain.CurrentDomain.SetData("AppDataPath", Path.Combine(builder.Environment.ContentRootPath, "app_data"));
AppDomain.CurrentDomain.SetData("LogPath", Path.Combine(builder.Environment.ContentRootPath, "logs"));

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Use(async (context, next) =>
{
    context.Response.Headers.Add("Content-Security-Policy", "default-src 'self';");
    await next();
});

app.Run();
