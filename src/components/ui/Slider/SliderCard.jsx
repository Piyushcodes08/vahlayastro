import Button from "../Button/Button"; 

const SliderCard = ({ course, isActive, onClick, onMouseEnter, cardRef }) => {
  return (
    <article 
      className="project-card" 
      data-active={isActive ? "true" : "false"}
      {...(isActive ? { active: "" } : {})}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      ref={cardRef}
    >
      <img className="project-card__bg" src={course.bgImage} alt={course.title} />
      <div className="project-card__content">
        <img className="project-card__thumb" src={course.thumbImage} alt={`${course.title} Thumbnail`} />
        <div className="project-card__text-container">
          <h3 className="project-card__title">{course.title}</h3>
          <p className="project-card__desc">{course.description}</p>
          <Button 
            variant="secondary" 
            className="project-card__btn !mt-2"
          >
            Enroll Now
          </Button>
        </div>
      </div>
    </article>
  );
};

export default SliderCard;
