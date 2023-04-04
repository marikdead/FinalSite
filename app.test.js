const rout = require('./router.js')

test('создание сервера',()=>{
  expect(rout.getInst()).toBeTruthy();
  }
)

test('Выполнение POST запроса',()=>{
  router = rout.getInst();
  expect(router.serverRoute('POST','/').name).toBe('PostIndexPageHandler')
})

test('Выполнение GET запроса',()=>{
  router = rout.getInst();
  expect(router.serverRoute('GET','/').name).toBe('GetIndexPageHandler')
})

test('Выполнение несуществующего запроса',()=>{
  router = rout.getInst();
  expect(router.serverRoute('GET','/123').name).toBe('undef')
})

test('Динамическое добавление путей и методов обработки', ()=>{
  router = rout.getInst();
  expect(router.serverRoute('GET','/123').name).toBe('undef')
  function G1E2T3(){}
  router.appendRoute('GET','/123',G1E2T3)
  expect(router.serverRoute('GET','/123').name).toBe('G1E2T3')
})

test('Ошибко опасные места',()=>{
  expect(rout.getInst(1)).toBeTruthy();
  router = rout.getInst();
  function G1E2T3(){}
  expect(router.serverRoute(undefined, undefined).name).toBe('undef')
  expect(router.serverRoute(undefined, 1).name).toBe('undef')
  expect(router.serverRoute(null, undefined).name).toBe('undef')
  expect(router.serverRoute(null, null).name).toBe('undef')
  expect(router.serverRoute(null, null, undefined).name).toBe('undef')
  expect(router.serverRoute(null, null, G1E2T3).name).toBe('undef')

  router.appendRoute(undefined,undefined,G1E2T3)
  expect(router.serverRoute(undefined, undefined).name).toBe('undef')
})

test('Режим трассировки (дебаг режим)', ()=>{
  router = rout.getInst();
  router.toDebug()
  expect(router.serverRoute('GET','/1234').name).toBe('undef')
  function G1E2T3(){}
  router.appendRoute('GET','/1234',G1E2T3)
  expect(router.serverRoute('GET','/1234').name).toBe('G1E2T3')
})