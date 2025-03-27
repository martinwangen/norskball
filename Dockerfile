# This is a minimal Dockerfile to satisfy Render.com's requirements
# The actual deployment uses pre-built images from Docker Hub
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5001
ENV ASPNETCORE_URLS=http://+:5001

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["backend/src/Norskball/Norskball.csproj", "backend/src/Norskball/"]
RUN dotnet restore "backend/src/Norskball/Norskball.csproj"
COPY . .
WORKDIR "/src/backend/src/Norskball"
RUN dotnet build "Norskball.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Norskball.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Norskball.dll"] 