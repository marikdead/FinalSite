class Router{
    static inst = null;

    constructor(){
        this.rout = new Map();
        this.debug = false;
    }

    static getInst(){
        if(!Router.inst) Router.inst = new Router();
        return Router.inst;
    }

    #getAddr(method,url){
        let str = method + ' ' + url;
        return str
    }

    serverRoute(req, res){
        const method = req.method;
        const url = req.url;
        if (!this.debug){
            const adr = this.#getAddr(method, url);
            if (!this.rout.has(adr)){
                function undef(req, res){return req.url}; return undef(req, res)
            }
            else{
                return this.rout.get(adr)(req, res)
            }
        }
        else{
            console.log("получение адреса")
            const adr = this.#getAddr(method, url);
            console.log("Проверка")
            if (!this.rout.has(adr)){
                function undef(){}; console.log("получение значения (адреса нет)"); return undef
            }
            else{
                console.log("получение значения (адрес есть)"); return this.rout.get(adr)
            }
        }

    }

    appendRoute(method, url, func){
        if (!this.debug){
            if ((typeof method === 'string') && (typeof url === 'string')){
                let str = this.#getAddr(method,url);
                this.rout.set(str, func);}
        }
        else{
            console.log("Проверка значений")
            if ((typeof method === 'string') && (typeof url === 'string')){
                console.log("получение адреса")
                let str = this.#getAddr(method,url);
                console.log("Добавление нового адреса в таблицу")
                this.rout.set(str, func);}
        }
    }

    toDebug(){
       this.debug = true
    }
    toDeDebug(){
        this.debug = false
    }

}

module.exports = Router;