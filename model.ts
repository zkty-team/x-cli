// 命名空间
const moduleID = "com.zkty.module.scan";

interface ScanOpenDto {

    name :string,
    age:int,
    //扫码结果 xx(result)
    __event__:(result)=>{};
}

function openScanView(arg:ScanOpenDto = {
  name:'zk',
  age:12,
    __event__:(result)=>{},
}){
    window.openScanView = () => {
        scan
          .openScanView()
          .then((res) => {});
      };
}
