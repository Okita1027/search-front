---
title: project-search
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# project-search

Base URLs:

# Authentication

# UserController

## POST 普通用户注册

POST /user/register

> Body 请求参数

```json
{
  "username": "string",
  "password": "string",
  "id": 0,
  "nickname": "string",
  "gender": 0,
  "profile": "string",
  "phone": "string",
  "email": "string",
  "avatarUrl": "string",
  "favorComment": "string",
  "status": 0,
  "editTime": "string",
  "createTime": "string",
  "updateTime": "string",
  "isDeleted": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[ContentUser](#schemacontentuser)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[Result](#schemaresult)|

## POST 普通用户登陆

POST /user/login

> Body 请求参数

```json
{
  "username": "string",
  "password": "string",
  "id": 0,
  "nickname": "string",
  "gender": 0,
  "profile": "string",
  "phone": "string",
  "email": "string",
  "avatarUrl": "string",
  "favorComment": "string",
  "status": 0,
  "editTime": "string",
  "createTime": "string",
  "updateTime": "string",
  "isDeleted": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[ContentUser](#schemacontentuser)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": {
    "tokenName": "",
    "tokenValue": "",
    "isLogin": false,
    "loginId": {},
    "loginType": "",
    "tokenTimeout": 0,
    "sessionTimeout": 0,
    "tokenSessionTimeout": 0,
    "tokenActiveTimeout": 0,
    "loginDeviceType": "",
    "tag": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultSaTokenInfo](#schemaresultsatokeninfo)|

## POST 普通用户退出登陆

POST /user/logout

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[Result](#schemaresult)|

## GET 获取用户列表

GET /user

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|text|query|string| 是 |用户名|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": {
    "nickname": "",
    "profile": "",
    "avatarUrl": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultContentUserVO](#schemaresultcontentuservo)|

## GET 获取某个用户信息

GET /user/info

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|username|query|string| 是 |用户名|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": {
    "nickname": "",
    "profile": "",
    "avatarUrl": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultContentUserVO](#schemaresultcontentuservo)|

## PUT 更新用户信息

PUT /user/info

> Body 请求参数

```json
{
  "username": "string",
  "password": "string",
  "id": 0,
  "nickname": "string",
  "gender": 0,
  "profile": "string",
  "phone": "string",
  "email": "string",
  "avatarUrl": "string",
  "favorComment": "string",
  "status": 0,
  "editTime": "string",
  "createTime": "string",
  "updateTime": "string",
  "isDeleted": 0,
  "rawPassword": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[ContentUserDTO](#schemacontentuserdto)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[Result](#schemaresult)|

## POST 给评论点赞

POST /user/favor

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|commentId|query|integer| 是 |评论ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[Result](#schemaresult)|

## POST 发布评论

POST /user/comment

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|articleTitle|query|string| 是 |文章标题|
|commentId|query|integer| 否 |评论ID（如果是回复其它评论，则不为null）|
|commentContent|query|string| 是 |评论内容|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[Result](#schemaresult)|

# AdminController

## POST 管理员登陆

POST /admin/login

> Body 请求参数

```json
{
  "username": "string",
  "password": "string",
  "id": 0,
  "createTime": "string",
  "updateTime": "string",
  "isDeleted": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[Admin](#schemaadmin)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": {
    "tokenName": "",
    "tokenValue": "",
    "isLogin": false,
    "loginId": {},
    "loginType": "",
    "tokenTimeout": 0,
    "sessionTimeout": 0,
    "tokenSessionTimeout": 0,
    "tokenActiveTimeout": 0,
    "loginDeviceType": "",
    "tag": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultSaTokenInfo](#schemaresultsatokeninfo)|

## POST 管理员登出

POST /admin/logout

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[Result](#schemaresult)|

## POST 踢出在线的用户

POST /admin/kickout

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|tokenName|query|string| 否 |none|
|tokenValue|query|string| 否 |none|
|isLogin|query|boolean| 否 |none|
|loginId.key|query|any| 否 |none|
|loginType|query|string| 否 |none|
|tokenTimeout|query|integer(int64)| 否 |none|
|sessionTimeout|query|integer(int64)| 否 |none|
|tokenSessionTimeout|query|integer(int64)| 否 |none|
|tokenActiveTimeout|query|integer(int64)| 否 |none|
|loginDeviceType|query|string| 否 |none|
|tag|query|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[Result](#schemaresult)|

## PUT 启用/封禁用户状态

PUT /admin/status

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|username|query|string| 是 |普通用户的用户名|
|status|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[Result](#schemaresult)|

# AudioController

## GET audio

GET /audio

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|text|query|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": {
    "fileName": "",
    "filePath": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultContentAudioVO](#schemaresultcontentaudiovo)|

## POST uploadFile

POST /audio/upload

> Body 请求参数

```yaml
file: string

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» file|body|string(binary)| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": ""
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultString](#schemaresultstring)|

# VideoController

## GET video

GET /video

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|text|query|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": {
    "fileName": "",
    "filePath": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultContentVideoVO](#schemaresultcontentvideovo)|

## POST uploadFile

POST /video/upload

> Body 请求参数

```yaml
file: string

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» file|body|string(binary)| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": ""
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultString](#schemaresultstring)|

# ArticleController

## GET 获取搜索候选项

GET /post/suggestion

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|suggestText|query|string| 是 |文章标题|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": ""
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultString](#schemaresultstring)|

## GET 获取文章列表

GET /post

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|text|query|string| 是 |文章标题|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": {
    "title": "",
    "content": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultContentArticleVO](#schemaresultcontentarticlevo)|

## GET 获取文章详情

GET /post/detail

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|text|query|string| 是 |文章标题|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": {
    "title": "",
    "content": "",
    "createBy": "",
    "createTime": "",
    "updateTime": "",
    "commentLikeDtoMap": {
      "0": [
        {
          "commentId": 0,
          "content": "",
          "parentUsername": "",
          "parentNickname": "",
          "currentUsername": "",
          "currentNickname": "",
          "createTime": "",
          "likeCount": 0
        }
      ]
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultArticleDetailVO](#schemaresultarticledetailvo)|

# PictureController

## GET 获取图片列表

GET /picture

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|text|query|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": {
    "pictureUrl": ""
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultContentPictureVO](#schemaresultcontentpicturevo)|

# CaptchaController

## GET genCaptcha

GET /captcha/generate

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|type|query|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "id": "",
  "captcha": {
    "type": "",
    "backgroundImage": "",
    "templateImage": "",
    "backgroundImageTag": "",
    "templateImageTag": "",
    "backgroundImageWidth": 0,
    "backgroundImageHeight": 0,
    "templateImageWidth": 0,
    "templateImageHeight": 0,
    "data": {}
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[CaptchaResponseImageCaptchaVO](#schemacaptcharesponseimagecaptchavo)|

## POST checkCaptcha

POST /captcha/check

> Body 请求参数

```json
{
  "id": "string",
  "data": {
    "bgImageWidth": 0,
    "bgImageHeight": 0,
    "templateImageWidth": 0,
    "templateImageHeight": 0,
    "startTime": "string",
    "stopTime": "string",
    "left": 0,
    "top": 0,
    "trackList": [
      {
        "x": 0,
        "y": 0,
        "t": 0,
        "type": "string"
      }
    ],
    "data": {}
  }
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[Data](#schemadata)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "",
  "data": null
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ApiResponse?](#schemaapiresponse?)|

## GET 二次验证，一般用于机器内部调用，这里为了方便测试

GET /captcha/check2

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|string| 是 |id|

> 返回示例

> 200 Response

```json
true
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|boolean|

# FileUploadController

## POST 文件上传

POST /upload

> Body 请求参数

```yaml
file: string

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» file|body|string(binary)| 是 |上传的文件（音频、视频、图片）|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[Result](#schemaresult)|

# 数据模型

<h2 id="tocS_0">0</h2>

<a id="schema0"></a>
<a id="schema_0"></a>
<a id="tocS0"></a>
<a id="tocs0"></a>

```json
{
  "commentId": 0,
  "content": "string",
  "parentUsername": "string",
  "parentNickname": "string",
  "currentUsername": "string",
  "currentNickname": "string",
  "createTime": "string",
  "likeCount": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|commentId|integer(int64)|false|none||评论ID，方便点赞|
|content|string|false|none||评论内容|
|parentUsername|string|false|none||父类：评论用户名、昵称；<br />当前：评论用户名、昵称|
|parentNickname|string|false|none||none|
|currentUsername|string|false|none||none|
|currentNickname|string|false|none||none|
|createTime|string|false|none||评论时间|
|likeCount|integer(int64)|false|none||点赞数量|

<h2 id="tocS_"></h2>

<a id="schema"></a>
<a id="schema_"></a>
<a id="tocS"></a>
<a id="tocs"></a>

```json
{}

```

### 属性

*None*

<h2 id="tocS_Result">Result</h2>

<a id="schemaresult"></a>
<a id="schema_Result"></a>
<a id="tocSresult"></a>
<a id="tocsresult"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {}
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||none|
|message|string|false|none||none|
|data|object|false|none||none|

<h2 id="tocS_ContentUser">ContentUser</h2>

<a id="schemacontentuser"></a>
<a id="schema_ContentUser"></a>
<a id="tocScontentuser"></a>
<a id="tocscontentuser"></a>

```json
{
  "username": "string",
  "password": "string",
  "id": 0,
  "nickname": "string",
  "gender": 0,
  "profile": "string",
  "phone": "string",
  "email": "string",
  "avatarUrl": "string",
  "favorComment": "string",
  "status": 0,
  "editTime": "string",
  "createTime": "string",
  "updateTime": "string",
  "isDeleted": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|username|string|false|none||用户名|
|password|string|false|none||密码|
|id|integer(int64)|false|none||id|
|nickname|string|false|none||昵称|
|gender|integer|false|none||性别 （0保密；1男性；2女性）|
|profile|string|false|none||个性签名|
|phone|string|false|none||电话号码|
|email|string|false|none||邮箱|
|avatarUrl|string|false|none||头像链接|
|favorComment|string|false|none||点赞过的评论ID|
|status|integer|false|none||状态(0停用；1启用)|
|editTime|string|false|none||用户编辑时间|
|createTime|string|false|none||创建时间|
|updateTime|string|false|none||更新时间|
|isDeleted|integer|false|none||是否删除|

<h2 id="tocS_SaTokenInfo">SaTokenInfo</h2>

<a id="schemasatokeninfo"></a>
<a id="schema_SaTokenInfo"></a>
<a id="tocSsatokeninfo"></a>
<a id="tocssatokeninfo"></a>

```json
{
  "tokenName": "string",
  "tokenValue": "string",
  "isLogin": true,
  "loginId": {},
  "loginType": "string",
  "tokenTimeout": 0,
  "sessionTimeout": 0,
  "tokenSessionTimeout": 0,
  "tokenActiveTimeout": 0,
  "loginDeviceType": "string",
  "tag": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|tokenName|string|false|none||none|
|tokenValue|string|false|none||none|
|isLogin|boolean|false|none||none|
|loginId|object|false|none||none|
|loginType|string|false|none||none|
|tokenTimeout|integer(int64)|false|none||none|
|sessionTimeout|integer(int64)|false|none||none|
|tokenSessionTimeout|integer(int64)|false|none||none|
|tokenActiveTimeout|integer(int64)|false|none||none|
|loginDeviceType|string|false|none||none|
|tag|string|false|none||none|

<h2 id="tocS_ResultSaTokenInfo">ResultSaTokenInfo</h2>

<a id="schemaresultsatokeninfo"></a>
<a id="schema_ResultSaTokenInfo"></a>
<a id="tocSresultsatokeninfo"></a>
<a id="tocsresultsatokeninfo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "tokenName": "string",
    "tokenValue": "string",
    "isLogin": true,
    "loginId": {},
    "loginType": "string",
    "tokenTimeout": 0,
    "sessionTimeout": 0,
    "tokenSessionTimeout": 0,
    "tokenActiveTimeout": 0,
    "loginDeviceType": "string",
    "tag": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||none|
|message|string|false|none||none|
|data|[SaTokenInfo](#schemasatokeninfo)|false|none||none|

<h2 id="tocS_ContentUserVO">ContentUserVO</h2>

<a id="schemacontentuservo"></a>
<a id="schema_ContentUserVO"></a>
<a id="tocScontentuservo"></a>
<a id="tocscontentuservo"></a>

```json
{
  "nickname": "string",
  "profile": "string",
  "avatarUrl": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|nickname|string|false|none||none|
|profile|string|false|none||none|
|avatarUrl|string|false|none||none|

<h2 id="tocS_ResultContentUserVO">ResultContentUserVO</h2>

<a id="schemaresultcontentuservo"></a>
<a id="schema_ResultContentUserVO"></a>
<a id="tocSresultcontentuservo"></a>
<a id="tocsresultcontentuservo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "nickname": "string",
    "profile": "string",
    "avatarUrl": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||none|
|message|string|false|none||none|
|data|[ContentUserVO](#schemacontentuservo)|false|none||none|

<h2 id="tocS_ContentUserDTO">ContentUserDTO</h2>

<a id="schemacontentuserdto"></a>
<a id="schema_ContentUserDTO"></a>
<a id="tocScontentuserdto"></a>
<a id="tocscontentuserdto"></a>

```json
{
  "username": "string",
  "password": "string",
  "id": 0,
  "nickname": "string",
  "gender": 0,
  "profile": "string",
  "phone": "string",
  "email": "string",
  "avatarUrl": "string",
  "favorComment": "string",
  "status": 0,
  "editTime": "string",
  "createTime": "string",
  "updateTime": "string",
  "isDeleted": 0,
  "rawPassword": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|username|string|false|none||用户名|
|password|string|false|none||密码|
|id|integer(int64)|false|none||id|
|nickname|string|false|none||昵称|
|gender|integer|false|none||性别 （0保密；1男性；2女性）|
|profile|string|false|none||个性签名|
|phone|string|false|none||电话号码|
|email|string|false|none||邮箱|
|avatarUrl|string|false|none||头像链接|
|favorComment|string|false|none||点赞过的评论ID|
|status|integer|false|none||状态(0停用；1启用)|
|editTime|string|false|none||用户编辑时间|
|createTime|string|false|none||创建时间|
|updateTime|string|false|none||更新时间|
|isDeleted|integer|false|none||是否删除|
|rawPassword|string|false|none||原始密码|

<h2 id="tocS_Admin">Admin</h2>

<a id="schemaadmin"></a>
<a id="schema_Admin"></a>
<a id="tocSadmin"></a>
<a id="tocsadmin"></a>

```json
{
  "username": "string",
  "password": "string",
  "id": 0,
  "createTime": "string",
  "updateTime": "string",
  "isDeleted": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|username|string|false|none||用户名|
|password|string|false|none||密码|
|id|integer(int64)|false|none||id|
|createTime|string|false|none||创建时间|
|updateTime|string|false|none||更新时间|
|isDeleted|integer|false|none||是否删除|

<h2 id="tocS_ContentAudioVO">ContentAudioVO</h2>

<a id="schemacontentaudiovo"></a>
<a id="schema_ContentAudioVO"></a>
<a id="tocScontentaudiovo"></a>
<a id="tocscontentaudiovo"></a>

```json
{
  "fileName": "string",
  "filePath": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|fileName|string|false|none||none|
|filePath|string|false|none||none|

<h2 id="tocS_ResultContentAudioVO">ResultContentAudioVO</h2>

<a id="schemaresultcontentaudiovo"></a>
<a id="schema_ResultContentAudioVO"></a>
<a id="tocSresultcontentaudiovo"></a>
<a id="tocsresultcontentaudiovo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "fileName": "string",
    "filePath": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||none|
|message|string|false|none||none|
|data|[ContentAudioVO](#schemacontentaudiovo)|false|none||none|

<h2 id="tocS_ResultString">ResultString</h2>

<a id="schemaresultstring"></a>
<a id="schema_ResultString"></a>
<a id="tocSresultstring"></a>
<a id="tocsresultstring"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||none|
|message|string|false|none||none|
|data|string|false|none||none|

<h2 id="tocS_ContentVideoVO">ContentVideoVO</h2>

<a id="schemacontentvideovo"></a>
<a id="schema_ContentVideoVO"></a>
<a id="tocScontentvideovo"></a>
<a id="tocscontentvideovo"></a>

```json
{
  "fileName": "string",
  "filePath": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|fileName|string|false|none||none|
|filePath|string|false|none||none|

<h2 id="tocS_ResultContentVideoVO">ResultContentVideoVO</h2>

<a id="schemaresultcontentvideovo"></a>
<a id="schema_ResultContentVideoVO"></a>
<a id="tocSresultcontentvideovo"></a>
<a id="tocsresultcontentvideovo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "fileName": "string",
    "filePath": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||none|
|message|string|false|none||none|
|data|[ContentVideoVO](#schemacontentvideovo)|false|none||none|

<h2 id="tocS_ContentArticleVO">ContentArticleVO</h2>

<a id="schemacontentarticlevo"></a>
<a id="schema_ContentArticleVO"></a>
<a id="tocScontentarticlevo"></a>
<a id="tocscontentarticlevo"></a>

```json
{
  "title": "string",
  "content": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|title|string|false|none||none|
|content|string|false|none||none|

<h2 id="tocS_ResultContentArticleVO">ResultContentArticleVO</h2>

<a id="schemaresultcontentarticlevo"></a>
<a id="schema_ResultContentArticleVO"></a>
<a id="tocSresultcontentarticlevo"></a>
<a id="tocsresultcontentarticlevo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "title": "string",
    "content": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||none|
|message|string|false|none||none|
|data|[ContentArticleVO](#schemacontentarticlevo)|false|none||none|

<h2 id="tocS_MapListCommentLikeDTO">MapListCommentLikeDTO</h2>

<a id="schemamaplistcommentlikedto"></a>
<a id="schema_MapListCommentLikeDTO"></a>
<a id="tocSmaplistcommentlikedto"></a>
<a id="tocsmaplistcommentlikedto"></a>

```json
{
  "0": [
    {
      "commentId": 0,
      "content": "string",
      "parentUsername": "string",
      "parentNickname": "string",
      "currentUsername": "string",
      "currentNickname": "string",
      "createTime": "string",
      "likeCount": 0
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|0|[[0](#schema0)]|false|none||none|

<h2 id="tocS_ArticleDetailVO">ArticleDetailVO</h2>

<a id="schemaarticledetailvo"></a>
<a id="schema_ArticleDetailVO"></a>
<a id="tocSarticledetailvo"></a>
<a id="tocsarticledetailvo"></a>

```json
{
  "title": "string",
  "content": "string",
  "createBy": "string",
  "createTime": "string",
  "updateTime": "string",
  "commentLikeDtoMap": {
    "0": [
      {
        "commentId": 0,
        "content": "string",
        "parentUsername": "string",
        "parentNickname": "string",
        "currentUsername": "string",
        "currentNickname": "string",
        "createTime": "string",
        "likeCount": 0
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|title|string|false|none||none|
|content|string|false|none||none|
|createBy|string|false|none||none|
|createTime|string|false|none||none|
|updateTime|string|false|none||none|
|commentLikeDtoMap|[MapListCommentLikeDTO](#schemamaplistcommentlikedto)|false|none||none|

<h2 id="tocS_ResultArticleDetailVO">ResultArticleDetailVO</h2>

<a id="schemaresultarticledetailvo"></a>
<a id="schema_ResultArticleDetailVO"></a>
<a id="tocSresultarticledetailvo"></a>
<a id="tocsresultarticledetailvo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "title": "string",
    "content": "string",
    "createBy": "string",
    "createTime": "string",
    "updateTime": "string",
    "commentLikeDtoMap": {
      "0": [
        {
          "commentId": 0,
          "content": "string",
          "parentUsername": "string",
          "parentNickname": "string",
          "currentUsername": "string",
          "currentNickname": "string",
          "createTime": "string",
          "likeCount": 0
        }
      ]
    }
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||none|
|message|string|false|none||none|
|data|[ArticleDetailVO](#schemaarticledetailvo)|false|none||none|

<h2 id="tocS_ContentPictureVO">ContentPictureVO</h2>

<a id="schemacontentpicturevo"></a>
<a id="schema_ContentPictureVO"></a>
<a id="tocScontentpicturevo"></a>
<a id="tocscontentpicturevo"></a>

```json
{
  "pictureUrl": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|pictureUrl|string|false|none||none|

<h2 id="tocS_ImageCaptchaVO">ImageCaptchaVO</h2>

<a id="schemaimagecaptchavo"></a>
<a id="schema_ImageCaptchaVO"></a>
<a id="tocSimagecaptchavo"></a>
<a id="tocsimagecaptchavo"></a>

```json
{
  "type": "string",
  "backgroundImage": "string",
  "templateImage": "string",
  "backgroundImageTag": "string",
  "templateImageTag": "string",
  "backgroundImageWidth": 0,
  "backgroundImageHeight": 0,
  "templateImageWidth": 0,
  "templateImageHeight": 0,
  "data": {}
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|type|string|false|none||none|
|backgroundImage|string|false|none||none|
|templateImage|string|false|none||none|
|backgroundImageTag|string|false|none||none|
|templateImageTag|string|false|none||none|
|backgroundImageWidth|integer|false|none||none|
|backgroundImageHeight|integer|false|none||none|
|templateImageWidth|integer|false|none||none|
|templateImageHeight|integer|false|none||none|
|data|object|false|none||none|

<h2 id="tocS_ResultContentPictureVO">ResultContentPictureVO</h2>

<a id="schemaresultcontentpicturevo"></a>
<a id="schema_ResultContentPictureVO"></a>
<a id="tocSresultcontentpicturevo"></a>
<a id="tocsresultcontentpicturevo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "pictureUrl": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||none|
|message|string|false|none||none|
|data|[ContentPictureVO](#schemacontentpicturevo)|false|none||none|

<h2 id="tocS_CaptchaResponseImageCaptchaVO">CaptchaResponseImageCaptchaVO</h2>

<a id="schemacaptcharesponseimagecaptchavo"></a>
<a id="schema_CaptchaResponseImageCaptchaVO"></a>
<a id="tocScaptcharesponseimagecaptchavo"></a>
<a id="tocscaptcharesponseimagecaptchavo"></a>

```json
{
  "id": "string",
  "captcha": {
    "type": "string",
    "backgroundImage": "string",
    "templateImage": "string",
    "backgroundImageTag": "string",
    "templateImageTag": "string",
    "backgroundImageWidth": 0,
    "backgroundImageHeight": 0,
    "templateImageWidth": 0,
    "templateImageHeight": 0,
    "data": {}
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|string|false|none||none|
|captcha|[ImageCaptchaVO](#schemaimagecaptchavo)|false|none||none|

<h2 id="tocS_ApiResponse?">ApiResponse?</h2>

<a id="schemaapiresponse?"></a>
<a id="schema_ApiResponse?"></a>
<a id="tocSapiresponse?"></a>
<a id="tocsapiresponse?"></a>

```json
{
  "code": 0,
  "msg": "string",
  "data": null
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||none|
|msg|string|false|none||none|
|data|null|false|none||none|

<h2 id="tocS_Track">Track</h2>

<a id="schematrack"></a>
<a id="schema_Track"></a>
<a id="tocStrack"></a>
<a id="tocstrack"></a>

```json
{
  "x": 0,
  "y": 0,
  "t": 0,
  "type": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|x|number|false|none||none|
|y|number|false|none||none|
|t|number|false|none||none|
|type|string|false|none||none|

<h2 id="tocS_ImageCaptchaTrack">ImageCaptchaTrack</h2>

<a id="schemaimagecaptchatrack"></a>
<a id="schema_ImageCaptchaTrack"></a>
<a id="tocSimagecaptchatrack"></a>
<a id="tocsimagecaptchatrack"></a>

```json
{
  "bgImageWidth": 0,
  "bgImageHeight": 0,
  "templateImageWidth": 0,
  "templateImageHeight": 0,
  "startTime": "string",
  "stopTime": "string",
  "left": 0,
  "top": 0,
  "trackList": [
    {
      "x": 0,
      "y": 0,
      "t": 0,
      "type": "string"
    }
  ],
  "data": {}
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|bgImageWidth|integer|false|none||none|
|bgImageHeight|integer|false|none||none|
|templateImageWidth|integer|false|none||none|
|templateImageHeight|integer|false|none||none|
|startTime|string|false|none||none|
|stopTime|string|false|none||none|
|left|integer|false|none||none|
|top|integer|false|none||none|
|trackList|[[Track](#schematrack)]|false|none||none|
|data|object|false|none||none|

<h2 id="tocS_Data">Data</h2>

<a id="schemadata"></a>
<a id="schema_Data"></a>
<a id="tocSdata"></a>
<a id="tocsdata"></a>

```json
{
  "id": "string",
  "data": {
    "bgImageWidth": 0,
    "bgImageHeight": 0,
    "templateImageWidth": 0,
    "templateImageHeight": 0,
    "startTime": "string",
    "stopTime": "string",
    "left": 0,
    "top": 0,
    "trackList": [
      {
        "x": 0,
        "y": 0,
        "t": 0,
        "type": "string"
      }
    ],
    "data": {}
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|string|false|none||none|
|data|[ImageCaptchaTrack](#schemaimagecaptchatrack)|false|none||none|

