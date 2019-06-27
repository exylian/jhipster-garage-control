package de.felixhoevel.garagecontrol.service;

import de.felixhoevel.garagecontrol.domain.GarageCode;
import de.felixhoevel.garagecontrol.repository.GarageCodeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link GarageCode}.
 */
@Service
@Transactional
public class GarageCodeService {

    private final Logger log = LoggerFactory.getLogger(GarageCodeService.class);

    private final GarageCodeRepository garageCodeRepository;

    public GarageCodeService(GarageCodeRepository garageCodeRepository) {
        this.garageCodeRepository = garageCodeRepository;
    }

    /**
     * Save a garageCode.
     *
     * @param garageCode the entity to save.
     * @return the persisted entity.
     */
    public GarageCode save(GarageCode garageCode) {
        log.debug("Request to save GarageCode : {}", garageCode);
        return garageCodeRepository.save(garageCode);
    }

    /**
     * Get all the garageCodes.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<GarageCode> findAll() {
        log.debug("Request to get all GarageCodes");
        return garageCodeRepository.findAll();
    }


    /**
     * Get one garageCode by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<GarageCode> findOne(Long id) {
        log.debug("Request to get GarageCode : {}", id);
        return garageCodeRepository.findById(id);
    }

    /**
     * Delete the garageCode by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete GarageCode : {}", id);
        garageCodeRepository.deleteById(id);
    }
}
