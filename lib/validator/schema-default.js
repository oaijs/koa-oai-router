const paramErrorSchema = {
  "title": "paramError",
  "schema": {
    "type": "object",
    "properties": {
      "status": {
        "type": "integer"
      },
      "type": {
        "type": "string"
      },
      "path": {
        "type": "string"
      },
      "error": {
        "type": "string"
      },
      "detail": {
        "type": "object"
      }
    }
  }
};

const defaultErrorSchema = {
  "title": "defaultError",
  "schema": {
    "type": "object",
    "properties": {
      "status": {
        "type": "integer"
      },
      "message": {
        "type": "string"
      },
      "stack": {
        "type": "string"
      }
    }
  }
};

export {
  paramErrorSchema,
  defaultErrorSchema
}
