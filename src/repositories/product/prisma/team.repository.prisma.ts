import type { PrismaClient } from "../../../generated/prisma/client.js";
import type { TeamRepository } from "../team.repository";
import { Team } from "../../../entities/team";

export class TeamRepositoryPrisma implements TeamRepository{


    private constructor (readonly prisma: PrismaClient){}

    public static build(prisma: PrismaClient){
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

    public async findByName(name: string): Promise<Team | null> {
        const team = await this.prisma.team.findFirst({ where: { name } });
        return team ? Team.restore(team) : null;
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

        const team = Team.restore({ id, name, colorPrimary, colorSecondary, allTimeScored, allTimeConceded })
    
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

    public async update( id: string,name?: string, colorPrimary?: string, colorSecondary?: string, allTimeScored?: number, allTimeConceded?: number ): Promise<void> {
        
        if(!id){
            throw new Error("Please insert a valid id team")
        }

        const existTeam = await this.prisma.team.findUnique({
            where:{
                id: id,
            }
        })

        if(!existTeam){
            throw new Error("This team doesn't exist");
        }

        const data: {
            name?: string,
            colorPrimary?: string,
            colorSecondary?: string,
            allTimeScored?: number,
            allTimeConceded?: number
        } = {};


        if(name !== undefined){
            data.name = name;
        }


        if (colorPrimary !== undefined) {
        data.colorPrimary = colorPrimary;
        }

        if (colorSecondary !== undefined) {
        data.colorSecondary = colorSecondary;
        }

        if (allTimeScored !== undefined) {
        data.allTimeScored = allTimeScored;
        }

        if (allTimeConceded !== undefined) {
        data.allTimeConceded = allTimeConceded;
        }
       
        
        await this.prisma.team.update({
            where: {
                id: id, 
            },
            data
        })

        

    }
    
}