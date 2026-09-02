---
name: dotnet10-invitations
description: Use ONLY when editing InvitacionesAPI .NET backend (net9.0 → net10.0, MongoDB.Driver, EF Core, Swagger, RSVP endpoints) — covers models, controllers, DI, async, and migration.
---

# .NET 10 Invitations Backend

Expert backend system for `LogicaRSVP_Plantillas/InvitacionesAPI`. Today `net9.0` (migrate to `net10.0` afterwards). Stack: `Microsoft.NET.Sdk.Web`, `MongoDB.Driver 3.5`, `EF Core SqlServer 9.0.10`, `Swashbuckle 9.0.6`, `DotNetEnv 3.1.1`. Host: `https://vellum-services.runasp.net`.

## 1. Project shape

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework> <!-- hoy net9.0 -->
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
</Project>
```

Run: `dotnet run --project InvitacionesAPI` — Swagger only in `Development`.

## 2. Program.cs

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o => o.AddPolicy("PermitirTodo",
  p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
builder.Services.AddSingleton<MongoDbService>();
var app = builder.Build();
if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }
app.UseHttpsRedirection();
app.UseCors("PermitirTodo");
app.UseAuthorization();
app.MapControllers();
app.Run();
```

**Rules**: CORS `PermitirTodo` is dev-only — harden in prod (explicit origins). Keep `MongoDbService` as singleton. Add health endpoint before migration.

## 3. Models (Models/Invitado.cs)

```csharp
public class Invitado {
  [BsonId][BsonRepresentation(BsonType.ObjectId)] public string? Id { get; set; }
  [BsonElement("evento_id")][BsonRepresentation(BsonType.ObjectId)] public string EventoId { get; set; } = string.Empty;
  [BsonElement("nombre")] public string Nombre { get; set; } = string.Empty;
  [BsonElement("asistencia")] public bool? Asistencia { get; set; } // null=pendiente, true, false
  [BsonElement("usos_restantes")] public int UsosRestantes { get; set; }
  [BsonElement("invitados")] public int CantidadInvitados { get; set; }
  [BsonElement("uuid")] public string Uuid { get; set; } = Guid.NewGuid().ToString();
  [BsonElement("mesa")] public int? Mesa { get; set; }
  [BsonElement("fecha_registro")][BsonDateTimeOptions(Kind=DateTimeKind.Utc)] public DateTime? FechaRegistro { get; set; }
}
public class Evento {
  public string? Id { get; set; }
  public string Nombre { get; set; } = string.Empty;
  public string NombreVisible { get; set; } = string.Empty;
  public string Slug { get; set; } = string.Empty;
  public DateTime Fecha { get; set; }
  public string Template { get; set; } = string.Empty;
  public List<string> Imagenes { get; set; } = new();
  public string? Musica { get; set; }
  public Dictionary<string, object> DatosPlantilla { get; set; } = new();
  public string Tamano { get; set; } = "pequeno"; // pequeno|mediano|grande
  public decimal Precio { get; set; }
  public bool Pagado { get; set; }
  public DateTime? FechaPagado { get; set; }
  public bool Activo { get; set; }
  public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
```

Keep `BsonElement` ↔ `JsonPropertyName` in sync. Never expose `UsosRestantes` decrement logic to client without auth.

## 4. Data

- `Data/AppDbContext.cs` — EF Core (SQL legacy, keep for compat).
- `Data/MongoDbService.cs` — Mongo singleton, collections `invitados`, `eventos`. Inject via `AddSingleton<MongoDbService>()`.

## 5. Controllers / Endpoints

Base `https://vellum-services.runasp.net/asistencia`:
- `GET /wakeup` — ping/warmup (called on DOMContentLoaded).
- `GET /qr/{uuid}` — returns `Invitado` for link `?datos={uuid}`.
- `POST /actualizar` — `{ uuid, asistencia: bool }` (currently commented in frontend 261-329; keep for admin confirmation).

Always:
```csharp
[ApiController][Route("asistencia")]
public class InvitadosController : ControllerBase {
  [HttpGet("qr/{uuid}")] public async Task<ActionResult<Invitado>> GetByUuid(string uuid, CancellationToken ct) { ... }
}
```

Use `async`/`await` + `CancellationToken ct` on every I/O. Validate with `FluentValidation` if added. Return `ProblemDetails` on error.

## 6. Security & prod hardening

- **Never return** CLABE / tarjeta / bank data in JSON (today leaked in HTML modal — keep it HTML-only or protected).
- Validate `uuid` format before DB hit.
- Rate-limit `/actualizar`.
- Harden CORS: `WithOrigins("https://karen-y-erick.vellumdigitall.online", "https://*.vellumdigitall.online")`.
- Env via `DotNetEnv` + `appsettings.{Env}.json`, never hardcode connection strings.

## 7. Migration net9 → net10

Steps:
1. `dotnet upgrade` or edit `TargetFramework` to `net10.0`.
2. `dotnet build` — fix `Nullable` warnings.
3. `dotnet list package --outdated` → bump `MongoDB.Driver`, `Swashbuckle`, `EF Core` to `net10` compatible.
4. `dotnet test` if any; manual `curl /wakeup`.
5. Verify `Publish` still outputs `InvitacionesAPI.dll` to `bin/Release/net10.0`.

## 8. Anti-patterns

- No `AllowAnyOrigin` in prod.
- No sync `Result`/`Wait()` on Mongo calls.
- No `ObjectId` as `int`.
- No exposing `Mesa` assignment endpoint without auth.
- No touching `InvitacionesAPI/` unless user explicitly says so (current phase: forbidden).

## 9. Checklist before commit

- [ ] `dotnet build` zero warnings.
- [ ] Swagger shows `/wakeup`, `/qr/{uuid}`, `/actualizar`.
- [ ] Models have `BsonElement` + `JsonPropertyName`.
- [ ] `Program.cs` registers `MongoDbService` singleton + CORS + Swagger dev only.
- [ ] No secrets in repo (`appsettings` gitignored or example-only).
- [ ] `CancellationToken` plumbed in controllers.
