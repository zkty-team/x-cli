
import {warning} from './util'
import {Tplt} from './Tplt'


export class ProtocolMethod extends Tplt {
methodName:string;
argType:string;
retType:string;
finalize(){
  return this.h() +"\n---------------\n" + this.m()
}
h(){
   let tmp=`   @required 
   `

  if(!this.argType && !this.retType){
    tmp+= `    - (void) _${this.methodName}:(void (^)(BOOL complete)) completionHandler;
    `
  }
  else if(!this.argType && this.retType){
    tmp+=`     - (void) _${this.methodName}:(void (^)(${this.retType} result,BOOL complete)) completionHandler;
    `
  }
  else if(this.argType && !this.retType){
    tmp+=`     - (void) _${this.methodName}:(${this.argType}) dto complete:(void (^)(BOOL complete)) completionHandler;
    `
  }
  else if(this.argType && this.retType)
  {
    tmp+=`     - (void) _${this.methodName}:(${this.argType}) dto complete:(void (^)(${this.retType} result,BOOL complete)) completionHandler;
` }
  return tmp;
}

m(){

}
}

export class ProtocolTmplt extends Tplt {
  moduleName:string
  methods:Array<ProtocolMethod>=[]

finalize(){
  return this.h() +"\n---------------\n" + this.m()
}
h(){
  return `
@protocol xengine__module_${this.moduleName}_protocol
    ${this.methods.map(p=>p.h()).join("\n   ")}
@end
  `
}
m(){
  return ``
}
}
export class PropertyTmplt extends Tplt {
  mod:string;
  type:string;
  nullable:boolean;
  name:string;
  finalize(){return this.h()+this.m()}
  h(){return `\t@property(nonatomic,${this.mod}) ${this.type} ${this.name};`}
  m(){return this.nullable?`\tif ([propertyName isEqualToString:@"${this.name}"]) { return YES; }`:""}
}
export class DTOTmplt extends Tplt {
  name:string;
  properties:Array<PropertyTmplt>=[];

  finalize(){return this.h()+"\n-----------------------\n"+this.m()}
  h(){
    return `
@interface ${this.name}: JSONModel
  ${this.properties.map(p=>p.h()).join("\n   ")}
@end
    `
  }
  m(){
    return `
@implementation ${this.name}
    + (BOOL)propertyIsOptional:(NSString *)propertyName {${this.properties.map(p=>p.m()).join("\n   ")}\treturn NO;
    }
@end
    `
  }
}
export class ClassMethodTmplt extends Tplt {
methodName:string;
argType?:string;
retType?:string;
retPrimitive:boolean;
h(){
  return `
  `
}
m(){
  let tmp=`  - (void) ${this.methodName}:(NSDictionary*) dict complete:(XEngineCallBack)completionHandler {
`
  if(!this.argType && !this.retType){
    tmp+= `
          [self _${this.methodName}:^(BOOL complete) {
                 completionHandler(nil,complete); 
          }];
    `
  }
  else if(!this.argType && this.retType){
    tmp+=`
          [self _${this.methodName}:^(${this.retType} result, BOOL complete) {
            completionHandler(result ,complete);
          }];
    `
  }
  else if(this.argType && !this.retType){
    tmp+=`
          ${this.argType} dto = [self convert:dict clazz:${this.argType.replace("*", "")}.class];
          [self _${this.methodName}:dto complete:^(BOOL complete) {
             completionHandler(nil ,complete);
          }];
    `
  }
  else if(this.argType && this.retType)
  {
    tmp+= `
          ${this.argType} dto = [self convert:dict clazz:${this.argType.replace("*", "")}.class];
          [self _${this.methodName}:dto complete:^(${this.retType} result,  BOOL complete) {
            completionHandler(result,complete);
          }];
        
    `
  }else{
    tmp+= "what the fuck?"
  }
  tmp+=`  }`
  return tmp;

}
  finalize(){return this.h()+"\n-----------------------\n"+this.m()}
}

export class ClassTmplt extends Tplt {
moduleID:string;
moduleName:string;
methods:Array<ClassMethodTmplt>=[];
finalize(){return this.h()+"----------"+this.m()}
h(){return `
@interface xengine__module_${this.moduleName} : xengine__module_BaseModule<xengine__module_${this.moduleName}_protocol>
@end
`}
m(){
  return `
  @implementation xengine__module_${this.moduleName}
    - (instancetype)init
    {
        self = [super init];
        return self;
    }

    - (NSString *)moduleId{
        return @"${this.moduleID}";
    }
    
  ${this.methods.map(m=>m.m()).join("\n  ")}
  @end`
}
}
export class FileTmplt extends Tplt{
  moduleName:string;
  protocolTmplt:ProtocolTmplt=new ProtocolTmplt();
  classTmplt:ClassTmplt=new ClassTmplt();
  dtoTmplts:Array<DTOTmplt>=[];
finalize(){return this.h()+"\n-----------------------\n"+this.m()}
hgen(path:string){
  this.gen_content(path+`/xengine__module_${this.moduleName}.h`,this.h())
}
mgen(path:string){
  this.gen_content(path+`/xengine__module_${this.moduleName}.m`,this.m())
}
h(){
return `
${warning()}

#import <xengine__module_BaseModule.h>
#import "JSONModel.h"

${this.dtoTmplts.map(dt=>"@protocol "+dt.name+";").join("\n")}
${this.dtoTmplts.map(dt=>dt.h()).join("\n")}

${this.protocolTmplt.h()}

${this.classTmplt.h()}
`
}

m(){
return `
${warning()}

#import "xengine__module_${this.moduleName}.h"
#import <micros.h>

${this.dtoTmplts.map(dt=>dt.m()).join("\n  ")}

${this.protocolTmplt.m()}

${this.classTmplt.m()}
`
}

}
