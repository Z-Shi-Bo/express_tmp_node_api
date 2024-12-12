// 创建连接
const OpenApi = require('@alicloud/openapi-client');
const OpenApiUtil = require('@alicloud/openapi-util');
const Util = require('@alicloud/tea-util');

class VodController {
  #region = 'cn-shanghai';
  constructor() {
    console.log('环境变量:', {
      ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
      NODE_ENV: process.env.NODE_ENV,
    });

    // 创建配置对象
    const config = new OpenApi.Config({
      accessKeyId: process.env.ACCESS_KEY_ID,
      accessKeySecret: process.env.ACCESS_KEY_SECRET,
      endpoint: `vod.${this.#region}.aliyuncs.com`,
      type: 'access_key',
    });
    console.log(process.env.ACCESS_KEY_ID);
    this.client = new OpenApi.default(config);
  }

  // 创建API基础参数
  createApiInfo(action) {
    return new OpenApi.Params({
      action,
      version: '2017-03-21',
      protocol: 'HTTPS',
      method: 'POST',
      authType: 'AK',
      style: 'RPC',
      pathname: '/',
      reqBodyType: 'json',
      bodyType: 'json',
    });
  }

  // 获取视频上传地址和认证
  async getUploadAuth(req, res) {
    try {
      const params = this.createApiInfo('CreateUploadVideo');
      const queries = {
        Title: req.body.title || '默认标题',
        FileName: req.body.filename || '1.mp4',
        Description: req.body.description || '',
        CoverURL: req.body.coverUrl || '',
        StorageLocation: '',
        FileSize: req.body.fileSize || 1024,
      };

      const runtime = new Util.RuntimeOptions({});
      const request = new OpenApi.OpenApiRequest({
        query: OpenApiUtil.default.query(queries),
      });

      const response = await this.client.callApi(params, request, runtime);

      if (!response.body) {
        throw new Error('API 响应异常');
      }

      res.status(200).json({
        uploadAuth: response.body.UploadAuth,
        uploadAddress: response.body.UploadAddress,
        videoId: response.body.VideoId,
        requestId: response.body.RequestId,
      });
    } catch (error) {
      console.error('VOD API Error:', error);
      res.status(500).json({
        error: '获取视频上传地址和认证失败',
        details: error.message,
      });
    }
  }

  // 获取视频播放地址
  async getPlayAuth(req, res) {
    try {
      const params = this.createApiInfo('GetPlayInfo');
      const queries = {
        VideoId: req.query.videoId,
        Formats: req.query.formats || 'mp4',
        Definition: req.query.definition || 'HD',
        ResultType: req.query.resultType || 'Multiple',
        OutputType: req.query.outputType || 'cdn',
      };

      const runtime = new Util.RuntimeOptions({});
      const request = new OpenApi.OpenApiRequest({
        query: OpenApiUtil.default.query(queries),
      });

      const response = await this.client.callApi(params, request, runtime);
      res.status(200).json({
        playInfoList: response.body.PlayInfoList.PlayInfo,
        videoBase: response.body.VideoBase,
      });
    } catch (error) {
      res.status(500).json({
        error: '获取播放地址失败',
        details: error.message,
      });
    }
  }
}
// 获取视频信息
exports.getUploadAuth = async (req, res) => {
  const vodController = new VodController();
  await vodController.getUploadAuth(req, res);
};
