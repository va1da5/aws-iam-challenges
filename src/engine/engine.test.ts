import { describe, test, expect } from "vitest";

import { IAMPolicyEngine } from "./index";
import { PolicyType } from "./values";

describe("Test wildcard functionality", () => {
  const engine = new IAMPolicyEngine({
    Version: "2012-10-17",
    Statement: [{ Effect: "Allow", Action: "*", Resource: "*" }],
  });

  test("Action match single wildcard", () => {
    expect(engine.wildcardMatch("iam:Get*", "iam:GetAccessKeyId")).toBeTruthy();
  });

  test("Match multiple wildcards", () => {
    expect(
      engine.wildcardMatch("iam:*AccessKey*", "iam:GetAccessKeyId"),
    ).toBeTruthy();
  });

  test("Match all", () => {
    expect(engine.wildcardMatch("*", "iam:GetAccessKeyId")).toBeTruthy();
  });

  test("Match service", () => {
    expect(engine.wildcardMatch("iam:*", "iam:PutAccessKey")).toBeTruthy();
  });

  test("Does not match wildcard", () => {
    expect(
      engine.wildcardMatch("iam:GetAccessKey*", "iam:PutAccessKeyId"),
    ).toBeFalsy();
  });

  test("Wildcard ARN as string", () => {
    expect(
      engine.wildcardMatch(
        "arn:aws:cloudtrail:*:111122223333:trail/*",
        "arn:aws:cloudtrail:us-east-2:444455556666:user/111122223333:trail/finance",
      ),
    ).toBeFalsy();
  });
});

describe("Test Resources", () => {
  const engine = new IAMPolicyEngine({
    Version: "2012-10-17",
    Statement: [{ Effect: "Allow", Action: "*", Resource: "*" }],
  });

  test("Resource match global wildcard", () => {
    expect(
      engine.resourceMatches(
        "arn:aws:s3:::amzn-s3-demo-bucket-production/test.jpg",
        "*",
      ),
    ).toBeTruthy();
  });

  test("Resource match global wildcard", () => {
    expect(
      engine.resourceMatches(
        "arn:aws:s3:::amzn-s3-demo-bucket-production/test.jpg",
        "",
      ),
    ).toBeFalsy();
  });

  test("Resource match global wildcard", () => {
    expect(
      engine.resourceMatches(
        "arn:aws:s3:::amzn-s3-demo-bucket-production/test.jpg",
        [""],
      ),
    ).toBeFalsy();
  });

  test("Resource match file wildcard", () => {
    expect(
      engine.resourceMatches(
        "arn:aws:s3:::amzn-s3-demo-bucket-production/test.jpg",
        "arn:aws:s3:::amzn-s3-demo-bucket-production/*",
      ),
    ).toBeTruthy();
  });

  test("Resource match multiple file wildcards", () => {
    expect(
      engine.resourceMatches(
        "arn:aws:s3:::amzn-s3-demo-bucket-production/test/account.jpg",
        "arn:aws:s3:::amzn-s3-demo-bucket-production/*/*.jpg",
      ),
    ).toBeTruthy();
  });

  test("Resource match region wildcard", () => {
    expect(
      engine.resourceMatches(
        "arn:aws:s3:::amzn-s3-demo-bucket-production/test.jpg",
        "arn:aws:s3:::amzn-s3-demo-bucket-production/*",
      ),
    ).toBeTruthy();
  });

  test("Resource match account wildcard", () => {
    expect(
      engine.resourceMatches(
        "arn:aws:s3:::amzn-s3-demo-bucket-production/test.jpg",
        "arn:aws:s3:::amzn-s3-demo-bucket-production/*",
      ),
    ).toBeTruthy();
  });

  test("Resource match account wildcard array", () => {
    expect(
      engine.resourceMatches(
        "arn:aws:s3:::amzn-s3-demo-bucket-production/test.jpg",
        [
          "arn:aws:s3:::amzn-s3-demo-bucket-test/*",
          "arn:aws:s3:::amzn-s3-demo-bucket-production/*",
        ],
      ),
    ).toBeTruthy();
  });

  test("Resource does not match account wildcard array", () => {
    expect(
      engine.resourceMatches(
        "arn:aws:s3:us-east-1:123456789012:amzn-s3-demo-bucket-production/test.jpg",
        [
          "arn:aws:s3:::amzn-s3-demo-bucket-test/*.jpg",
          "arn:aws:s3:::amzn-s3-demo-bucket-uat/*.gif",
        ],
      ),
    ).toBeFalsy();
  });

  test("Resource case sensitive", () => {
    expect(
      engine.resourceMatches(
        "arn:aws:s3:us-east-1:123456789012:amzn-s3-demo-bucket-production/test.jpg",
        ["arn:aws:s3:::amzn-s3-demo-bucket-production/Test.jpg"],
      ),
    ).toBeFalsy();
  });
});

describe("Test Actions", () => {
  const engine = new IAMPolicyEngine({
    Version: "2012-10-17",
    Statement: [{ Effect: "Allow", Action: "*", Resource: "*" }],
  });

  test("Action match global wildcard", () => {
    expect(engine.actionMatches("sqs:SendMessage", "*")).toBeTruthy();
  });

  test("Action match service wildcard", () => {
    expect(engine.actionMatches("sqs:SendMessage", "sqs:*")).toBeTruthy();
  });

  test("Action match service action wildcard", () => {
    expect(engine.actionMatches("s3:GetObject", "s3:Get*")).toBeTruthy();
  });

  test("Action match service action multiple wildcard", () => {
    expect(
      engine.actionMatches("iam:DeleteAccessKey", "iam:*AccessKey*"),
    ).toBeTruthy();
  });

  test("Action match service action multiple wildcard array", () => {
    expect(
      engine.actionMatches("iam:DeleteAccessKey", ["iam:*AccessKey*"]),
    ).toBeTruthy();
  });

  test("Action does not match service action wildcard array", () => {
    expect(
      engine.actionMatches("iam:DeleteAccessKey", ["s3:*", "sqs:*"]),
    ).toBeFalsy();
  });

  test("Action match service action wildcard array", () => {
    expect(
      engine.actionMatches("iam:DeleteAccessKey", ["s3:*", "iam:*", "sqs:*"]),
    ).toBeTruthy();
  });

  test("Action with invalid service", () => {
    expect(() => {
      engine.actionMatches("iam:DeleteAccessKey", ["s*:", "iam:*", "sqs:*"]);
    }).toThrowError(
      /^Invalid Service In Action: The service s\* specified in the action does not exist$/,
    );

    expect(() => {
      engine.actionMatches("iam:DeleteAccessKey", [
        "ec*:Get*",
        "iam:*",
        "sqs:*",
      ]);
    }).toThrowError(
      /^Invalid Service In Action: The service ec\* specified in the action does not exist$/,
    );

    expect(() => {
      engine.actionMatches("iam:DeleteAccessKey", ["S3", "iam:*", "sqs:*"]);
    }).toThrowError(/^Invalid Action: The action S3 does not exist.$/);

    expect(() => {
      engine.actionMatches("iam:DeleteAccessKey", ["S3:", "iam:*", "sqs:*"]);
    }).toThrowError(/^Invalid Action: The action S3: does not exist.$/);
  });
});

describe("Test Validation", () => {
  test("Valid policy", () => {
    expect(() => {
      new IAMPolicyEngine({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: "s3:GetObject",
            Resource: "arn:aws:s3:::amzn-s3-demo-bucket",
          },
        ],
      });
    }).toBeTruthy();
  });

  test("Invalid policy element policy", () => {
    expect(() => {
      new IAMPolicyEngine({
        // @ts-expect-error Object literal may only specify known properties, but 'version' does not exist in type 'Policy'. Did you mean to write 'Version'?
        version: "2012-10-17",
        Statement: [{ Effect: "Allow", Action: "*", Resource: "*" }],
      });
    }).toThrowError(/^Invalid policy format: 'Version' element is missing$/);

    expect(() => {
      new IAMPolicyEngine({
        Version: "2012-10-17",
        // @ts-expect-error Object literal may only specify known properties, but 'statement' does not exist in type 'Policy'. Did you mean to write 'Statement'?
        statement: [],
      });
    }).toThrowError(/^Invalid policy format: 'Statement' element is missing$/);

    expect(() => {
      new IAMPolicyEngine({
        // @ts-expect-error Type '"2012-10-25"' is not assignable to type '"2008-10-17" | "2012-10-17"'. Did you mean '"2012-10-17"'?
        Version: "2012-10-25",
        Statement: [{ Effect: "Allow", Action: "*", Resource: "*" }],
      });
    }).toThrowError(
      /^Incorrect policy version. Allowed: 2012-10-17, 2008-10-17$/,
    );
  });

  test("Invalid policy statement elements", () => {
    expect(() => {
      new IAMPolicyEngine({
        Version: "2012-10-17",
        Statement: [
          {
            // @ts-expect-error Object literal may only specify known properties, but 'effect' does not exist in type 'Statement'. Did you mean to write 'Effect'?
            effect: "Allow",
            Action: "s3:GetObject",
            Resource: "*",
          },
        ],
      });
    }).toThrowError(
      /^Invalid statement 0 format: Unsupported statement element 'effect'$/,
    );

    expect(() => {
      new IAMPolicyEngine({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: "s3:GetObject",
            Resource: "*",
            // @ts-expect-error Object literal may only specify known properties, and 'Custom' does not exist in type 'Statement'.
            Custom: "spam",
          },
        ],
      });
    }).toThrowError(
      /^Invalid statement 0 format: Unsupported statement element 'Custom'$/,
    );

    expect(() => {
      new IAMPolicyEngine(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "s3:GetObject",
            },
          ],
        },
        PolicyType.Identity,
      );
    }).toThrowError(
      /^Invalid statement 0 format: Resource or NotResource element is required$/,
    );

    expect(() => {
      new IAMPolicyEngine(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "s3:GetObject",
              Resource: "*",
              Principal: {
                Service: "cloudformation.amazonaws.com",
              },
            },
          ],
        },
        PolicyType.Identity,
      );
    }).toThrowError(
      /^Invalid statement 0 format: Principal and NotPrincipal elements are not allowed$/,
    );

    expect(() => {
      new IAMPolicyEngine(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "s3:GetObject",
              Resource: "*",
            },
          ],
        },
        PolicyType.Resource,
      );
    }).toThrowError(
      /^Invalid statement 0 format: Principal or NotPrincipal element is required$/,
    );

    expect(() => {
      new IAMPolicyEngine(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "s3:GetObject",
            },
          ],
        },
        PolicyType.Trust,
      );
    }).toThrowError(
      /^Invalid statement 0 format: Principal element is required$/,
    );

    expect(() => {
      new IAMPolicyEngine(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "s3:GetObject",
              Resource: "*",
              Principal: {
                Service: "cloudformation.amazonaws.com",
              },
            },
          ],
        },
        PolicyType.Trust,
      );
    }).toThrowError(
      /^Invalid statement 0 format: Resource and NotResource elements are not allowed$/,
    );
  });

  test("Mutually exclusive policy statements elements", () => {
    expect(() => {
      new IAMPolicyEngine(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "s3:GetObject",
              Resource: "*",
              NotResource:
                "arn:aws:s3:us-east-1:123456789012:amzn-s3-demo-bucket",
            },
          ],
        },
        PolicyType.Identity,
      );
    }).toThrowError(
      /^Invalid statement 0 format: Resource and NotResource are mutually exclusive$/,
    );

    expect(() => {
      new IAMPolicyEngine(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "*",
              NotAction: "s3:GetObject",
              Resource: "*",
            },
          ],
        },
        PolicyType.Identity,
      );
    }).toThrowError(
      /^Invalid statement 0 format: Action and NotAction are mutually exclusive$/,
    );

    expect(() => {
      new IAMPolicyEngine(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "s3:GetObject",
              Principal: {
                AWS: "*",
              },
              NotPrincipal: {
                AWS: "arn:aws:iam::111122223333:role/MyRole",
              },
            },
          ],
        },
        PolicyType.Trust,
      );
    }).toThrowError(
      /^Invalid statement 0 format: Principal and NotPrincipal are mutually exclusive$/,
    );
  });

  test("Elements with empty values", () => {
    expect(() => {
      new IAMPolicyEngine(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "s3:GetObject",
              Resource: "",
            },
          ],
        },
        PolicyType.Identity,
      );
    }).toThrowError(
      /^Invalid statement 0 format: incorrect Resource definition$/,
    );

    expect(() => {
      new IAMPolicyEngine(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "s3:GetObject",
              Resource: ["*", ""],
            },
          ],
        },
        PolicyType.Identity,
      );
    }).toThrowError(
      /^Invalid statement 0 format: incorrect Resource definition$/,
    );

    expect(() => {
      new IAMPolicyEngine(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: ["s3:GetObject", ""],
              Resource: "*",
            },
          ],
        },
        PolicyType.Identity,
      );
    }).toThrowError(
      /^Invalid statement 0 format: incorrect Action definition$/,
    );

    expect(() => {
      new IAMPolicyEngine(
        {
          Version: "2012-10-17",
          Statement: [
            {
              // @ts-expect-error Type '"Allows"' is not assignable to type 'Effect'. Did you mean '"Allow"'?
              Effect: "Allows",
              Action: "s3:GetObject",
              Resource: "*",
            },
          ],
        },
        PolicyType.Identity,
      );
    }).toThrowError(
      /^Invalid statement 0 format: incorrect Effect definition 'Allows'$/,
    );
  });

  test("Resource ARN", () => {
    expect(() => {
      new IAMPolicyEngine(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "s3:GetObject",
              Resource: "*",
            },
          ],
        },
        PolicyType.Identity,
      );
    }).toBeTruthy();

    expect(() => {
      new IAMPolicyEngine(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "s3:GetObject",
              Resource: "arn:aws:s3:::amzn-s3-demo-bucket",
            },
          ],
        },
        PolicyType.Identity,
      );
    }).toBeTruthy();

    expect(() => {
      new IAMPolicyEngine(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "s3:GetObject",
              Resource: ":aws:s3:::amzn-s3-demo-bucket",
            },
          ],
        },
        PolicyType.Identity,
      );
    }).toThrowError(
      /^Invalid statement 0 format: incorrect Resource definition. Invalid ARN: ":aws:s3:::amzn-s3-demo-bucket"$/,
    );

    expect(() => {
      new IAMPolicyEngine(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "s3:GetObject",
              Resource: "arn::s3:::amzn-s3-demo-bucket",
            },
          ],
        },
        PolicyType.Identity,
      );
    }).toThrowError(
      /^Invalid statement 0 format: incorrect Resource definition. Invalid ARN partition "". Supported values \*, aws, aws-cn, aws-us-gov.$/,
    );

    expect(() => {
      new IAMPolicyEngine(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "s3:GetObject",
              Resource: "arn:aws::::amzn-s3-demo-bucket",
            },
          ],
        },
        PolicyType.Identity,
      );
    }).toThrowError(
      /^Invalid statement 0 format: incorrect Resource definition. Invalid ARN service: ""$/,
    );

    expect(() => {
      new IAMPolicyEngine(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "s3:GetObject",
              Resource: "arn:aws:s3:::",
            },
          ],
        },
        PolicyType.Identity,
      );
    }).toThrowError(
      /^Invalid statement 0 format: incorrect Resource definition. Empty ARN resource part$/,
    );
  });
});
