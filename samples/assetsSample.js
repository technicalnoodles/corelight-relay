let assetsResolve = {
  assets: [
    {
      description: "description",
      asset_type: "device",
      valid_time: {
        start_time: "2020-01-11T00:40:48.212Z",
        end_time: "2525-01-01T00:00:00.000Z",
      },
      schema_version: "1.0.19",
      revision: 1,
      type: "asset",
      source: "source",
      external_ids: [
        "http://ex.tld/ctia/asset/asset-61884b14-e273-4930-a5ff-dcce69207724",
      ],
      short_description: "short description",
      title: "CBROZEFS-DH-123",
      external_references: [
        {
          source_name: "source",
          external_id: "T1061",
          url: "https://ex.tld/wiki/T1061",
          hashes: ["#section1"],
          description: "Description text",
        },
      ],
      source_uri: "http://example.com/asset",
      language: "language",
      id: "http://ex.tld/ctia/asset/asset-61884b14-e273-4930-a5ff-dcce69207724",
      tlp: "green",
      timestamp: "2016-02-11T00:40:48.212Z",
    },
  ],
  "asset-mappings": [
    {
      asset_type: "device",
      valid_time: {
        start_time: "2020-01-11T00:40:48.212Z",
        end_time: "2525-01-01T00:00:00.000Z",
      },
      stability: "Managed",
      schema_version: "1.0.19",
      revision: 1,
      observable: {
        type: "ip",
        value: "100.213.110.122",
      },
      asset_ref:
        "http://ex.tld/ctia/asset/asset-61884b14-e273-4930-a5ff-dcce69207724",
      type: "asset-mapping",
      source: "cisco:unified_connect",
      external_ids: [
        "http://ex.tld/ctia/asset-mapping/asset-mapping-636ef2cc-1cb0-47ee-afd4-ecc1fe4be451",
      ],
      external_references: [
        {
          source_name: "source",
          external_id: "T1061",
          url: "https://ex.tld/wiki/T1061",
          hashes: ["#section1"],
          description: "Description text",
        },
      ],
      source_uri: "http://example.com/asset-mapping",
      language: "language",
      id:
        "http://ex.tld/ctia/asset-mapping/asset-mapping-668d86a2-02c1-499f-b953-5383be954aa6",
      tlp: "green",
      timestamp: "2016-02-11T00:40:48.212Z",
      specificity: "Unique",
      confidence: "High",
    },
  ],
};

let assetsResolveLatest = {
  assets: [
    {
      description: "description",
      asset_type: "device",
      valid_time: {
        start_time: "2020-01-11T00:40:48.212Z",
        end_time: "2525-01-01T00:00:00.000Z",
      },
      schema_version: "1.0.19",
      revision: 1,
      type: "asset",
      source: "source",
      external_ids: [
        "http://ex.tld/ctia/asset/asset-61884b14-e273-4930-a5ff-dcce69207724",
      ],
      short_description: "short description",
      title: "CBROZEFS-DH-123",
      external_references: [
        {
          source_name: "source",
          external_id: "T1061",
          url: "https://ex.tld/wiki/T1061",
          hashes: ["#section1"],
          description: "Description text",
        },
      ],
      source_uri: "http://example.com/asset",
      language: "language",
      id: "http://ex.tld/ctia/asset/asset-61884b14-e273-4930-a5ff-dcce69207724",
      tlp: "green",
      timestamp: "2016-02-11T00:40:48.212Z",
    },
  ],
};

let assetsDescribe = [
  {
    assets: [
      {
        description: "description",
        asset_type: "device",
        valid_time: {
          start_time: "2020-01-11T00:40:48.212Z",
          end_time: "2525-01-01T00:00:00.000Z",
        },
        schema_version: "1.0.19",
        revision: 1,
        type: "asset",
        source: "source",
        external_ids: [
          "http://ex.tld/ctia/asset/asset-61884b14-e273-4930-a5ff-dcce69207724",
        ],
        short_description: "short description",
        title: "CBROZEFS-DH-123",
        external_references: [
          {
            source_name: "source",
            external_id: "T1061",
            url: "https://ex.tld/wiki/T1061",
            hashes: ["#section1"],
            description: "Description text",
          },
        ],
        source_uri: "http://example.com/asset",
        language: "language",
        id:
          "http://ex.tld/ctia/asset/asset-61884b14-e273-4930-a5ff-dcce69207724",
        tlp: "green",
        timestamp: "2016-02-11T00:40:48.212Z",
      },
    ],
    "asset-mappings": [
      {
        asset_type: "device",
        valid_time: {
          start_time: "2020-01-11T00:40:48.212Z",
          end_time: "2525-01-01T00:00:00.000Z",
        },
        stability: "Managed",
        schema_version: "1.0.19",
        revision: 1,
        observable: {
          type: "ip",
          value: "100.213.110.122",
        },
        asset_ref:
          "http://ex.tld/ctia/asset/asset-61884b14-e273-4930-a5ff-dcce69207724",
        type: "asset-mapping",
        source: "cisco:unified_connect",
        external_ids: [
          "http://ex.tld/ctia/asset-mapping/asset-mapping-636ef2cc-1cb0-47ee-afd4-ecc1fe4be451",
        ],
        external_references: [
          {
            source_name: "source",
            external_id: "T1061",
            url: "https://ex.tld/wiki/T1061",
            hashes: ["#section1"],
            description: "Description text",
          },
        ],
        source_uri: "http://example.com/asset-mapping",
        language: "language",
        id:
          "http://ex.tld/ctia/asset-mapping/asset-mapping-668d86a2-02c1-499f-b953-5383be954aa6",
        tlp: "green",
        timestamp: "2016-02-11T00:40:48.212Z",
        specificity: "Unique",
        confidence: "High",
      },
    ],
    "asset-properties": {
      properties: [
        {
          name: "cisco:securex:posture:score",
          value: "23",
        },
      ],
      valid_time: {
        start_time: "2020-01-11T00:40:48.212Z",
        end_time: "2525-01-01T00:00:00.000Z",
      },
      schema_version: "1.0.19",
      revision: 1,
      asset_ref:
        "http://ex.tld/ctia/asset/asset-61884b14-e273-4930-a5ff-dcce69207724",
      type: "asset-properties",
      source: "cisco:unified_connect",
      external_ids: [
        "http://ex.tld/ctia/asset-properties/asset-properties-97c3dbb5-6deb-4eed-b6d7-b77fa632cc7b",
      ],
      external_references: [
        {
          source_name: "source",
          external_id: "T1061",
          url: "https://ex.tld/wiki/T1061",
          hashes: ["#section1"],
          description: "Description text",
        },
      ],
      source_uri: "http://example.com/asset-properties",
      language: "language",
      id:
        "http://ex.tld/ctia/asset-properties/asset-properties-97c3dbb5-6deb-4eed-b6d7-b77fa632cc7b",
      tlp: "green",
      timestamp: "2016-02-11T00:40:48.212Z",
    },
  },
];

let assetsLocate = [
  {
    observables: [
      {
        type: "ipv6",
        value: "blah",
      },
    ],
    "asset-mappings": [
      {
        asset_type: "device",
        valid_time: {
          start_time: "2020-01-11T00:40:48.212Z",
          end_time: "2525-01-01T00:00:00.000Z",
        },
        stability: "Managed",
        schema_version: "1.0.19",
        revision: 1,
        observable: {
          type: "ip",
          value: "100.213.110.122",
        },
        asset_ref:
          "http://ex.tld/ctia/asset/asset-61884b14-e273-4930-a5ff-dcce69207724",
        type: "asset-mapping",
        source: "cisco:unified_connect",
        external_ids: [
          "http://ex.tld/ctia/asset-mapping/asset-mapping-636ef2cc-1cb0-47ee-afd4-ecc1fe4be451",
        ],
        external_references: [
          {
            source_name: "source",
            external_id: "T1061",
            url: "https://ex.tld/wiki/T1061",
            hashes: ["#section1"],
            description: "Description text",
          },
        ],
        source_uri: "http://example.com/asset-mapping",
        language: "language",
        id:
          "http://ex.tld/ctia/asset-mapping/asset-mapping-668d86a2-02c1-499f-b953-5383be954aa6",
        tlp: "green",
        timestamp: "2016-02-11T00:40:48.212Z",
        specificity: "Unique",
        confidence: "High",
      },
    ],
  },
];

module.exports = {
  assetsResolve,
  assetsResolveLatest,
  assetsDescribe,
  assetsLocate,
};
