using System.Diagnostics;
using HotChocolate.Execution;
using Microsoft.AspNetCore.Builder;
using Serilog;

namespace Norskball.Extensions;

public static class SchemaGenerationExtensions
{
    public static void UseSchemaGeneration(this IApplicationBuilder app)
    {
        if (Debugger.IsAttached)
        {
            string baseDirectory = AppContext.BaseDirectory;
            string solutionPath = FindSolutionPath(baseDirectory);
            string parentDirectory = Directory.GetParent(solutionPath).FullName;

            var resolver = app.ApplicationServices.GetService<IRequestExecutorResolver>();
            if (resolver != null)
            {
                var executor = resolver.GetRequestExecutorAsync().Result;
                if (executor != null)
                {
                    string filePath = System.IO.Path.Combine(parentDirectory, "schema.graphql");
                    File.WriteAllText(filePath, executor.Schema.ToString());
                    Log.Debug("Schema written to {filePath}", filePath);
                }
            }
            else
            {
                throw new Exception("Cannot find IRequestExecutorResolver, fixme!");
            }
        }
    }

    private static string FindSolutionPath(string baseDirectory)
    {
        // Navigate up until we find the solution root (where src directory is)
        var directory = new DirectoryInfo(baseDirectory);
        while (directory != null && !Directory.Exists(System.IO.Path.Combine(directory.FullName, "src")))
        {
            directory = directory.Parent;
        }

        if (directory == null)
        {
            throw new Exception("Cannot find solution root directory (looking for 'src' directory)");
        }

        return directory.FullName;
    }
} 