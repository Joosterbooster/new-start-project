//validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (typeof validatableInput.value === "string") {
    if (validatableInput.minLength != null) {
      isValid =
        isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null) {
      isValid =
        isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
  }
  if (typeof validatableInput.value === "number") {
    if (validatableInput.min != null) {
      isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null) {
      isValid = isValid && validatableInput.value <= validatableInput.max;
    }
  }
  return isValid;
}

//AutoBind decorator
function Bindthis(
  _: any, //target
  _2: string | Symbol | number, //methodName
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  return <PropertyDescriptor>{
    configurable: true,
    enumerable: false,
    get() {
      return originalMethod.bind(this);
    },
  };
}

//
interface Project {
  title: string;
  description: string;
  numberOfPersons: number;
}

//ProjectList
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  listElement: HTMLElement;

  constructor(private type: "active" | "finished") {
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById("project-list")!
    );
    this.hostElement = <HTMLDivElement>document.getElementById("app")!;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.listElement = importedNode.firstElementChild as HTMLElement;
    this.listElement.id = `${this.type}-projects`;
    this.attach();
    this.renderContent();
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.listElement.querySelector("ul")!.id = listId;
    this.listElement.querySelector("h2")!.textContent =
      this.type.toLocaleUpperCase() + " PROJECTS";
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.listElement);
  }
}

//ProjectInput
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  formElement: HTMLFormElement;
  //project: Project;
  title: HTMLInputElement;
  description: HTMLInputElement;
  people: HTMLInputElement;

  constructor() {
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById("project-input")!
    );
    this.hostElement = <HTMLDivElement>document.getElementById("app")!;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    this.formElement.id = "user-input";

    /* this.project = {
      title: (this.formElement.querySelector("#title") as HTMLInputElement)
        .value,
      description: (
        this.formElement.querySelector("#description") as HTMLInputElement
      ).value,
      numberOfPersons: +(
        this.formElement.querySelector("#people") as HTMLInputElement
      ).value,
    }; */

    this.title = this.formElement.querySelector("#title") as HTMLInputElement;
    this.description = this.formElement.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.people = this.formElement.querySelector("#people") as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.title.value;
    const enteredDescription = this.description.value;
    const enteredPeople = this.people.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descValidatable: Validatable = {
      value: enteredDescription,
      required: false,
      maxLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };
    if (
      !validate(titleValidatable) ||
      !validate(descValidatable) ||
      !validate(peopleValidatable)
    ) {
      console.log("invalid input");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.title.value = "";
    this.description.value = "";
    this.people.value = "";
  }

  @Bindthis
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
    }
    this.clearInputs();
  }

  private configure() {
    this.formElement.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
  }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finisedPrjList = new ProjectList("finished");
