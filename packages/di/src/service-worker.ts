onmessage = function (_e: any) {
  console.log('Worker: Message received from main script')
  postMessage('Please write two numbers')
}
