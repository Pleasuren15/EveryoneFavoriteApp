var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    .WithDataVolume("postgres-data");

var tododb = postgres.AddDatabase("todos");

var redis = builder.AddRedis("redis")
    .WithDataVolume("redis-data");

var serviceBus = builder.AddAzureServiceBus("servicebus")
    .RunAsEmulator(configure =>
    {
        configure.WithLifetime(ContainerLifetime.Persistent);
    })
    .AddServiceBusQueue("todo-queue");

var storage = builder.AddAzureStorage("storage")
    .RunAsEmulator(azurite =>
    {
        azurite.WithLifetime(ContainerLifetime.Persistent);
    });
var blobs = storage.AddBlobs("blobs");

var todoWeb = builder.AddJavaScriptApp("todo-web", "../todo.web")
    .WithRunScript("dev")
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints();

builder.Build().Run();
