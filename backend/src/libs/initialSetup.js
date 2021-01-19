import Role from '../models/Role';

// Function for create basics roles (Admin and User)
export const createRoles = async () => {
    try {
        // Verify if Roles exists
        const count = await Role.findAndCountAll();

        // If exist then exit
        if( count.count > 0 ) return;

        // If not exist create basics Roles
        const values = await Promise.all( [
            Role.create( {
                id : 1,
                name : "Admin"
            }, {
                fields : [ 'id', 'name' ]
            }),
            
            Role.create( {
                id : 2,
                name : "User"
            }, {
                fields : [ 'id', 'name' ]
            })
        ] );

        console.log( values );

    } catch (error) {
        console.log(error);
    }
};