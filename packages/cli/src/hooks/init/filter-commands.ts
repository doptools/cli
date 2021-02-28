import Command from '@oclif/command';
import { Hook } from '@oclif/config'

const hook: Hook<'init'> = async function (options) {


  const cmds = options.config.commands.filter(c => {
    if (c.id.startsWith('_')) {
      return false;
    }
    return false;
  });
  options.config.commands.splice(0, options.config.commands.length, ...cmds);


  options.config.commands.forEach(c => {
 
    var currentScope = 'gloabl';



    if (c.id.startsWith('_')) {
      const p = c.id.split(":");
      const scope = p.shift()?.substr(1);
      c.id = p.join(':');
      if (scope !== currentScope) {
        const oldId =  c.id;
        c.id = `____disabled.${Math.random()}____`;
        c.hidden = true;
        c.load = () => {
          return class DUMMY extends Command {
            id = c.id;
            async run() { this.error(`Incorrect command scope. '${oldId}' can only run in ${scope} scope.`) }
          }
        };
      }
    }
    /*if(c.id.startsWith('_global:')){
      c.id = 'qqqqq';
    }else if(c.id.startsWith('_workspace:')){
      c.id = 'qqqqq';
    }else if(c.id.startsWith('_project:')){
      c.id = 'qqqqq';
    }*/
  })

}

export default hook;