using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using Norskball.Models;
using Norskball.Data;
namespace Norskball.GraphQL.Queries;

[ExtendObjectType("Query")]
public class RefereeQuery
{
    
    public async Task<IEnumerable<Referee>> GetReferees(NorskballDbContext db)
    {
        return await db.Referees.ToListAsync();
    }

    public async Task<Referee?> GetReferee(NorskballDbContext db, Guid id)
    {
        return await db.Referees.FindAsync(id);
    }
} 