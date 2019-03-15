export default function makePatchComment ({ editComment }) {
  return async function patchComment (httpRequest) {
    try {
      const commentInfo = { ...httpRequest.body, id: httpRequest.params.id }
      const patched = await editComment(commentInfo)
      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date(patched.modified).toUTCString()
        },
        statusCode: 200,
        body: { patched }
      }
    } catch (e) {
      if (e.name === 'RangeError') {
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 404,
          body: {
            error: e.message
          }
        }
      }
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 400,
        body: {
          error: e.message
        }
      }
    }
  }
}
