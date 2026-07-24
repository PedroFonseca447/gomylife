import type { PrismaClient } from "../../../generated/prisma/client.js";
import type { TeamRepository } from "../team.repository";
import { Team } from "../../../entities/team";

export class TeamRepositoryPrisma implements TeamRepository{


    private constructor (readonly prisma: PrismaClient){}

    public build(prisma: PrismaClient){
         return new TeamRepositoryPrisma(prisma);
    }

    public async save(team: Team): Promise<void>{
        const newTeam = {
            id: team.idTeam,
            name: team.teamName,
            colorPrimary: team.colorPrimary,
            colorSecondary: team.colorSecondary,
            allTimeScored: 0,
            allTimeConceded: 0,
        }

        await this.prisma.team.create({
            data:{
                id: newTeam.id,
                name: newTeam.name,
                colorPrimary: newTeam.colorPrimary,
                colorSecondary: newTeam.colorSecondary,
                allTimeScored: newTeam.allTimeScored,
                allTimeConceded: newTeam.allTimeConceded
            }
        })
    }

    public async find(id: string): Promise<Team | null>{

        if(!id){
            throw new Error('Adicione um id')
        }

        const teamFind = await this.prisma.team.findUnique({
            where:{
                id: id,
            }
        })

        if(!teamFind){
            return null;
        }

        const { name, colorPrimary, colorSecondary, allTimeScored, allTimeConceded} = teamFind;

        const team = Team.create(id, name, colorPrimary,colorSecondary,allTimeConceded,allTimeScored)
    
        return team;

    }


    public async list(): Promise<Team[]>{
        const allTeamSave = await this.prisma.team.findMany();

        const teams: Team[] = allTeamSave.map((index) => {

            const {id, name, colorPrimary, colorSecondary, allTimeScored, allTimeConceded} = index;
            
            return Team.create(id,name,colorPrimary,colorSecondary,allTimeScored,allTimeConceded); 
        })
        
        return teams;
    }
    
}