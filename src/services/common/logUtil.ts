class Log {
  public async getResponse(
    message: string,
    success: boolean,
    facility: string
  ) {
    const response = {
      message,
      success: success
    };
    
    const additionalFields = {
      application_name: process.env.APPLICATION_NAME,
      source: process.env.SERVER,
      has_failure: success,
      org_key: "none",
      who_am_i: "SYSTEM",
      session_id: "none",
      dwopen_server_id: "none"
    };
    try {
      if (success) {
        console.log(response, response, additionalFields);
      } else {
        console.error(response, response, additionalFields);
      }
    } catch (e) {
      console.error(e);
    }
    return response;
  }
}

export = Log;
