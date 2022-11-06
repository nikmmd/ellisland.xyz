import { parseCaseToISODateString, parseFormName } from "./parser";
import { expect } from "@jest/globals";

const mockBody = [
  "As of November 1, 2022, we are actively reviewing your Form I-485, Application to Register Permanent Residence or Adjust Status, Receipt Number IEO123123123. Our records show nothing is outstanding at this time. We will let you know if we need anything from you. If you move, go to www.uscis.gov/addresschange to give us your new mailing address",
  "As of August 14, 2020, we are actively reviewing your Form I-765, Application to Register Permanent Residence or Adjust Status, Receipt Number IEO123123123. Our records show nothing is outstanding at this time. We will let you know if we need anything from you. If you move, go to www.uscis.gov/addresschange to give us your new mailing address",
  "On October 7, 2021, we received your Form I-130, Petition for Alien Relative, Receipt Number IEOX1231231, and sent you a receipt notice or acceptance notice.  The notice describes how we will process your case.  Please follow the instructions in the notice.  If you move, go to www.uscis.gov/addresschange  to give us your new mailing address.",
];

it("Should extract update date from case response body", () => {
    const valid = ["2022-11-01", "2020-08-14", "2021-10-07"];
    const parsed = mockBody.map((b) => parseCaseToISODateString(b));
    expect(parsed).toEqual(valid);

})

it("Should extract form number from case response body", () => {
    const valid = ["I-485","I-765", "I-130"]
    const parsed = mockBody.map((b) => parseFormName(b));
    expect(parsed).toEqual(valid)
});