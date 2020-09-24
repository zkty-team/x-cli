
import {warning} from './util'

export class MethodTplt  { 
  methodName: string;
  argType: string;
  retType: string;

  argline(){
    return `${this.argType} data= convert(obj,${this.argType}.class);`
  }

  finalize() {
        if(!this.argType && !this.retType){
  return `
    @JavascriptInterface
    final public void ${this.methodName}(JSONObject obj, final CompletionHandler<Object> handler) {
      _${this.methodName}(new CompletionHandler<Nullable>() {
        @Override
        public void complete(Nullable retValue) { handler.complete(null); }
        @Override
        public void complete() { handler.complete(); }
        @Override
        public void setProgressData(Nullable value) { handler.setProgressData(null); }
      });

    }`;
        }
        else if(!this.argType && this.retType){
  return `
    @JavascriptInterface
    final public void ${this.methodName}(JSONObject obj, final CompletionHandler<Object> handler) {
      _${this.methodName}(new CompletionHandler<${this.retType}>() {
        @Override
        public void complete(${this.retType} retValue) { handler.complete(retValue); }
        @Override
        public void complete() { handler.complete(); }
        @Override
        public void setProgressData(${this.retType} value) { handler.setProgressData(value); }
      });

    }`;
        }
        else if(this.argType && !this.retType){
  return `
    @JavascriptInterface
    final public void ${this.methodName}(JSONObject obj, final CompletionHandler<Object> handler) {
      ${this.argline()}
      _${this.methodName}(data, new CompletionHandler<Nullable>() {
        @Override
        public void complete(Nullable retValue) { handler.complete(null); }
        @Override
        public void complete() { handler.complete(); }
        @Override
        public void setProgressData(Nullable value) { handler.setProgressData(null); }
      });

    }`;
        }
        else if(this.argType && this.retType){
  return `
    @JavascriptInterface
    final public void ${this.methodName}(JSONObject obj, final CompletionHandler<Object> handler) {
      ${this.argline()}
      _${this.methodName}(data, new CompletionHandler<${this.retType}>() {
        @Override
        public void complete(${this.retType} retValue) { handler.complete(retValue); }
        @Override
        public void complete() { handler.complete(); }
        @Override
        public void setProgressData(${this.retType} value) { handler.setProgressData(value); }
      });

    }`;
       }
  }
};
export class iMethodTplt  { 
  methodName: string;
  argType: string;
  retType: string;

  finalize() {
        if(!this.argType && !this.retType){
          return `public void _${this.methodName}(final CompletionHandler<Nullable> handler);`;
        }
        else if(!this.argType && this.retType){
          return `public void _${this.methodName}(final CompletionHandler<${this.retType}> handler);`;
        }
        else if(this.argType && !this.retType){
          return `public void _${this.methodName}(${this.argType} dto, final CompletionHandler<Nullable> handler);`;
        }
        else if(this.argType && this.retType){
          return `public void _${this.methodName}(${this.argType} dto, final CompletionHandler<${this.retType}> handler);`;
       }
  }
};
export class DtoTplt {
  clsname: string;
  properties:Array<string>=[];

  finalize(){
  return `
  class ${this.clsname} {
    ${this.properties.join("\n    ")}  }`;
  }
}
export class InterfaceTplt {
  clsname: string;
  imethods: Array<string>;

  finalize(){
  return `
  interface ${this.clsname}_i {
    ${this.imethods.join("\n")}
  }
  `;
  }
}

export class ClassTplt {
  clsname: string;
  methods: Array<MethodTplt>;
  moduleID:string;

  finalize(){
  return `
  public abstract class ${this.clsname} extends xengine__module_BaseModule implements ${this.clsname}_i {
    @Override
    public String moduleId() {
      return "${this.moduleID}";
    }
  ${this.methods.map(m=>m.finalize()).join("\n")}
  }
  `;
  }
}

export class FileTplt {
  dtos: Array<DtoTplt> = [];
  clazz: string = "";
  interf: string ="";
  packageName: string = "";

  finalize(): string {
    return `
${warning()}
  package ${this.packageName};

  import java.util.List;
  import java.util.Map;
  import java.util.Set;
  import android.webkit.JavascriptInterface;
  import com.alibaba.fastjson.JSONObject;
  import com.zkty.modules.dsbridge.CompletionHandler;
  import com.zkty.modules.engine.annotation.Optional;
  import com.zkty.modules.engine.core.xengine__module_BaseModule;
  import androidx.annotation.Nullable;

  ${this.dtos.map(d=>d.finalize()).join("\n  ")}
  ${this.interf}
  ${this.clazz}

  `;
  }
}

//let t = new Tplt()
//t.dtos=["hello","world","hello","world"]
//let  o = t.finalize()
//console.log(o)
