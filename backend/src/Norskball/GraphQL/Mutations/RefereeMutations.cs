using Norskball.Data;
using Norskball.Models;

namespace Norskball.GraphQL.Mutations;

[ExtendObjectType("Mutation")]
public class RefereeMutations
{
    public async Task<Referee> CreateReferee( NorskballDbContext db, Referee input)
    {
        var referee = new Referee
        {
            Id = Guid.NewGuid(),
            Name = input.Name,
            PhotoUrl = input.PhotoUrl,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Referees.Add(referee);
        await db.SaveChangesAsync();
        return referee;
    }

    public async Task<Referee?> UpdateReferee(NorskballDbContext db, Referee input)
    {
        var referee = await db.Referees.FindAsync(input.Id);
        if (referee == null)
            throw new GraphQLException($"Referee with ID {input.Id} not found.");

        referee.Name = input.Name ?? referee.Name;
        referee.PhotoUrl = input.PhotoUrl ?? referee.PhotoUrl;
        referee.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return referee;
    }

    public async Task<bool> DeleteReferee(NorskballDbContext db, Guid id)
    {
        var referee = await db.Referees.FindAsync(id);
        if (referee == null)
            throw new GraphQLException($"Referee with ID {id} not found.");

        db.Referees.Remove(referee);
        await db.SaveChangesAsync();
        return true;
    }
}